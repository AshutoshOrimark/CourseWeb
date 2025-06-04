import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CourseMasterService } from '../../../../services/course-master.service';
import { CourseModuleService } from '../../../../services/course-module.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-course-module',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './course-module.component.html',
  styleUrl: './course-module.component.css'
})
export class CourseModuleComponent {
  ActiveTab = 'Add';
  moduleForm!: FormGroup;
  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  paginatedData: any[] = [];
  courses: any[] = [];
  modules: any[] = [];
  filteredModules: any[] = [];
  selectedModuleId: string | null = null;
  selectedCourseId: string | null = null;
  sortColumn: string = '';
  sortDirection: boolean = true;
  selectedAttachmentModuleId: number | null = null;
  selectedAttachmentModuleName: string | null = null;
  selectedAttachmentCourseName: string | null = null;
  attachmentFiles: File[] = [];
  newVideoUrl: string = '';
  videoUrls: { url: string, duration: string }[] = []; 
  isFetchingDuration: boolean = false;



  constructor(
    private fb: FormBuilder,
    private courseService: CourseMasterService,
    private moduleService: CourseModuleService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    this.moduleForm = this.fb.group({
      CourseId: ['0', Validators.required],
      ModuleName: ['', Validators.required],
      ModuleDescription: ['', Validators.required],
      SequenceNo: ['', [Validators.required]],
      Status: ["Active"], // Default to active
    });
    
    this.loadCourses();
    this.loadModules();
  }

  changeActiveTab(tabName: string) {
    this.ActiveTab = tabName;
    if (tabName === 'Add') {
      this.resetForm();
      this.moduleForm.get('CourseId')?.setValue('0'); // Reset CourseId to '0'
    }
  }

  onSubmit(): void {
    if (this.moduleForm.invalid) {
      this.toastr.warning('Please fill all required fields.', 'Validation Error');
      return;
    }

    const courseIdValue = this.moduleForm.value.CourseId;
    if (!courseIdValue || courseIdValue === '0') {
      this.toastr.warning('Please select a valid Course.', 'Validation Error');
      return;
    }

    if (this.selectedModuleId) {
      const payload = {
        ...this.moduleForm.value,
        CourseId: Number(courseIdValue)
      };
      this.moduleService.updateModule(this.selectedModuleId, payload).subscribe({
        next: () => {
          this.toastr.success('Module updated successfully!', 'Success');
          this.resetForm();
          this.loadModules();
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Failed to update Module.', 'Error');
        },
      });
    } else {
      this.moduleService.createModule({
        ...this.moduleForm.value,
        CourseId: Number(courseIdValue)
      }).subscribe({
        next: () => {
          this.toastr.success('Module created successfully!', 'Success');
          this.resetForm();
          this.loadModules();
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Failed to create Module.', 'Error');
        },
      });
    }
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        
        this.courses = data;
        this.filterData();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to load courses.', 'Error');
      }
    });
  }

  loadModules(): void {
    this.moduleService.getModules().subscribe({
      next: (data) => {
        console.log(data);
        this.modules = data;
        this.filterData();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to load Modules.', 'Error');
      }
    });
  }

  editModule(ModuleId: number): void {
    this.moduleService.getModuleById(ModuleId.toString()).subscribe({
      next: (module) => {
        this.changeActiveTab('Add');
        this.selectedModuleId = ModuleId.toString();      

        this.moduleForm.patchValue({     
          CourseId: module.CourseId.toString(), // Ensure CourseId is a string     
          ModuleName: module.ModuleName,
          ModuleDescription: module.ModuleDescription,
          SequenceNo: module.SequenceNo.toString(),
          Status: module.Status, // <-- should be module.Status
        });
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to fetch Module details.', 'Error');
      }
    });
  }

  deleteModule(ModuleId: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.moduleService.deleteModule(ModuleId.toString()).subscribe({
        next: () => {
          this.moduleService.getModules().subscribe({
            next: (data) => {
              this.modules = data;
              this.filterData();
              this.toastr.success('Module deleted successfully!', 'Success');
            },
            error: (err) => {
              console.error(err);
              this.toastr.error('Failed to reload modules after delete.', 'Error');
            }
          });
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Failed to delete Module.', 'Error');
        }
      });
    }
  }

  filterData(): void {
    const search = this.searchText.toLowerCase();
    this.filteredModules = this.modules.filter(module =>
      Object.values(module).some(value =>
        value !== null &&
        value !== undefined &&
        String(value).toLowerCase().includes(search)
      )
    );

    this.totalPages = Math.ceil(this.filteredModules.length / this.itemsPerPage);
    this.goToPage(1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.filteredModules.slice(startIndex, endIndex);
  }

  resetForm(): void {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    this.moduleForm.reset({
      CourseId: '0', // or '0' if that's your default
      ModuleName: '',
      ModuleDescription: '',
      SequenceNo: '',
      Status: 'Active', // <-- Ensure Status is set
    });
    this.selectedModuleId = null;
  }

  sortData(column: string): void {
    this.sortDirection = this.sortColumn === column ? !this.sortDirection : true;
    this.sortColumn = column;

    this.filteredModules.sort((a, b) => {
      const valueA = a[column]?.toString().toLowerCase() || '';
      const valueB = b[column]?.toString().toLowerCase() || '';
      return this.sortDirection ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });

    this.goToPage(1);
  }

  setItemsPerPage(items: number | string): void {
    if (items === 'all') {
      this.itemsPerPage = this.filteredModules.length; // Show all items
    } else {
      this.itemsPerPage = Number(items); // Convert to number if not already
    }
    this.currentPage = 1;
    this.filterData();
  }

  private formatDate(date: string): string {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Custom validator to check if start_date is less than or equal to end_date
  private dateRangeValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const startDate = formGroup.get('start_date')?.value;
      const endDate = formGroup.get('end_date')?.value;

      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        return { dateRangeInvalid: true };
      }
      return null;
    };
  }

  // Add this method to handle inline SequenceNo patch update
  onSequenceNoChange(moduleId: number, newValue: string) {
    const sequenceNo = Number(newValue);
    if (!Number.isNaN(sequenceNo)) {
      this.moduleService.getModuleById(moduleId.toString()).subscribe({
        next: (module) => {
          const updatedModule = {
            ...module,
            SequenceNo: sequenceNo.toString(),
            // Always use the CourseId from the module being updated
            CourseId: module.CourseId
          };
          this.moduleService.updateModule(moduleId.toString(), updatedModule).subscribe({
            next: () => {
              this.toastr.success('Sequence No. updated!', 'Success');
              const localModule = this.modules.find(m => m.ModuleId === moduleId);
              if (localModule) localModule.SequenceNo = sequenceNo;
            },
            error: () => {
              this.toastr.error('Failed to update Sequence No.', 'Error');
            }
          });
        },
        error: () => {
          this.toastr.error('Failed to fetch Module details.', 'Error');
        }
      });
    }
  }

   
   AttachmentPopup(moduleId: number, moduleName: string, courseName:string): void {
    this.selectedAttachmentModuleId = moduleId;
    this.selectedAttachmentModuleName = moduleName.toString();
    this.selectedAttachmentCourseName = courseName;
    // Show the Bootstrap modal
    const modalElement = document.getElementById('attachmentModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      // Listen for modal close event to reset selectedAttachmentModuleId
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.selectedAttachmentModuleId = null;
        this.selectedAttachmentModuleName = null;
        this.selectedAttachmentCourseName = null;
        this.attachmentFiles = [];
      }, { once: true });
      modal.show();
    }
  }

  fetchYoutubeDuration() {
    if (!this.newVideoUrl) return;
    this.isFetchingDuration = true;
    this.moduleService.getYoutubeDuration(this.newVideoUrl).subscribe({
      next: (res) => {
        this.videoUrls.push({ url: this.newVideoUrl, duration: res.duration });
        this.newVideoUrl = '';
        this.isFetchingDuration = false;
      },
      error: (err) => {
        alert('Failed to fetch duration: ' + (err.error?.detail || err.message));
        this.isFetchingDuration = false;
      }
    });
  }

  // addAttachmentInput() {
  //   this.attachmentFiles.push(null as any); // Add a placeholder for a new file input
  // }

  // removeAttachmentInput(index: number) {
  //   this.attachmentFiles.splice(index, 1);
  // }

  // onFileChange(event: any, index: number) {
  //   const file = event.target.files[0];
  //   this.attachmentFiles[index] = file;
  // }
}


