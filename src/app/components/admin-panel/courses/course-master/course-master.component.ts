import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CourseMasterService } from '../../../../services/course-master.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { ImageUploadService } from '../../../../services/image-upload.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CategoryMasterService } from '../../../../services/category-master.service';


@Component({
    selector: 'app-course-master',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule, 
        
    ],
    templateUrl: './course-master.component.html',
    styleUrl: './course-master.component.css',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CourseMasterComponent implements OnInit {
    ActiveTab = 'Add';
    courseForm!: FormGroup;
    searchText: string = '';
    currentPage: number = 1;
    itemsPerPage: number = 10;
    totalPages: number = 0;
    paginatedData: any[] = [];
    courses: any[] = [];
    filteredCourses: any[] = [];
    selectedCourseId: string | null = null;
    sortColumn: string = '';
    sortDirection: boolean = true;
    stars: number[] = [1, 2, 3, 4, 5];
    hoverRating: number | null = null;
    categories: any[] = [];
    course_information: string = '';

    constructor(
        private fb: FormBuilder,
        private courseService: CourseMasterService,
        private imageUploadService: ImageUploadService,
        private toastr: ToastrService,
        private categoryService: CategoryMasterService,

    ) { }

    ngOnInit() {
      this.courseForm = this.fb.group({
          course_name: ['', Validators.required],
          course_description: ['', Validators.required],
          course_info: [this.course_information || '', Validators.required],
          course_language: [''],
          banner_image: [''],
          author: [''],
          rating: [0, Validators.required],
          actual_price: [0, [Validators.required, Validators.min(0)]],
          discounted_price: [0, [Validators.required, Validators.min(0)]],
          is_premium: [false],
          is_best_seller: [false],
          video_path: ['', Validators.required],
          is_public: [false],
          category_id: ['', Validators.required],
          // created_by, status, created_on are handled by backend
      });
  
      this.loadCourses();
      this.loadcategories();
  }

    changeActiveTab(tabName: string) {
        this.ActiveTab = tabName;
        if (tabName === 'Add') this.resetForm();
    }

    loadcategories(): void {
        this.categoryService.getCategory().subscribe({
            next: (data) => {
                console.log(data);
                this.categories = data;                
            },
            error: (err) => {
                console.error(err);
                this.toastr.error('Failed to load categories.', 'Error');
            }
        });
    }
    onSubmit(): void {
        if (this.courseForm.invalid) {
            this.toastr.warning('Please fill all required fields.', 'Validation Error');
            return;
        }
        console.log(this.courseForm.value);
        if (this.selectedCourseId) {
            this.courseService.updateCourse(this.selectedCourseId, this.courseForm.value).subscribe({
                next: () => {
                    this.toastr.success('Course updated successfully!', 'Success');
                    this.resetForm();
                    this.loadCourses();
                },
                error: (err) => {
                    console.error(err);
                    this.toastr.error('Failed to update course.', 'Error');
                },
            });
        } else {
            this.courseService.createCourse(this.courseForm.value).subscribe({
                next: () => {
                    this.toastr.success('Course created successfully!', 'Success');
                    this.resetForm();
                    this.loadCourses();
                },
                error: (err) => {
                    console.error(err);
                    this.toastr.error('Failed to create course.', 'Error');
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

    editCourse(courseId: number): void {
        this.courseService.getCourseById(courseId.toString()).subscribe({
            next: (course) => {
                this.changeActiveTab('Add');
                this.selectedCourseId = courseId.toString();
                // Patch form
                this.courseForm.patchValue({
                    course_name: course.course_name,
                    course_description: course.course_description,
                    course_info: course.course_info,
                    course_language: course.course_language,
                    banner_image: course.banner_image,
                    author: course.author,
                    rating: course.rating,
                    actual_price: course.actual_price,
                    discounted_price: course.discounted_price,
                    is_premium: course.is_premium,
                    is_best_seller: course.is_best_seller,
                    video_path: course.video_path,
                    is_public: course.is_public,
                    category_id: course.category_id,
                });
                // Set Trix editor content after patch (2 seconds delay)
                setTimeout(() => {
                    const trixEditor = document.querySelector('trix-editor[input="courseInfoInput"]') as any;
                    if (trixEditor) {
                        trixEditor.editor.loadHTML(course.course_info || '');
                    }
                }, 2000);
            },
            error: (err) => {
                this.toastr.error('Failed to fetch course details.', 'Error');
            }
        });
    }

    deleteCourse(courseId: number): void {
        if (confirm('Are you sure you want to delete this course?')) {
            this.courseService.deleteCourse(courseId.toString()).subscribe({
                next: () => {
                    this.toastr.success('Course deleted successfully!', 'Success');
                    this.loadCourses();
                    this.filterData();
                },
                error: (err) => {
                    console.error(err);
                    this.toastr.error('Failed to delete course.', 'Error');
                }
            });
        }
    }

    filterData(): void {
        this.filteredCourses = this.courses.filter(course =>
            Object.values(course).some(value =>
                typeof value === 'string' && value.toLowerCase().includes(this.searchText.toLowerCase())
            )
        );

        this.totalPages = Math.ceil(this.filteredCourses.length / this.itemsPerPage);
        this.goToPage(1);
    }

    goToPage(page: number): void {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        const startIndex = (page - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.paginatedData = this.filteredCourses.slice(startIndex, endIndex);
    }

    resetForm(): void {
        this.courseForm.reset({
            course_name: '',
            course_description: '',
            course_info: '',
            course_language: '',
            banner_image: '',
            author: '',
            rating: 0,
            actual_price: 0,
            discounted_price: 0,
            is_premium: false,
            is_best_seller: false,
            video_path: '',
            is_public: false,
            category_id: '',
        });
        this.selectedCourseId = null;
        // Clear Trix editor content (2 seconds delay)
        setTimeout(() => {
            const trixEditor = document.querySelector('trix-editor[input="courseInfoInput"]') as any;
            if (trixEditor) {
                trixEditor.editor.loadHTML('');
            }
        }, 2000);
    }

    sortData(column: string): void {
        this.sortDirection = this.sortColumn === column ? !this.sortDirection : true;
        this.sortColumn = column;

        this.filteredCourses.sort((a, b) => {
            const valueA = a[column]?.toString().toLowerCase() || '';
            const valueB = b[column]?.toString().toLowerCase() || '';
            return this.sortDirection ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        });

        this.goToPage(1);
    }

    setItemsPerPage(items: number | string): void {
        if (items === 'all') {
            this.itemsPerPage = this.filteredCourses.length; // Show all items
        } else {
            this.itemsPerPage = Number(items); // Convert to number if not already
        }
        this.currentPage = 1;
        this.filterData();
    }

    onBannerImageChange(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            this.imageUploadService.uploadCourseImage(file).subscribe({
                next: (res) => {
                    this.courseForm.patchValue({ banner_image: res.path });
                    this.toastr.success('Banner image uploaded!', 'Success');
                },
                error: () => {
                    this.toastr.error('Failed to upload image.', 'Error');
                }
            });
        }
    }

    setRating(rating: number) {
        this.courseForm.get('rating')?.setValue(rating);
    }

    setHoverRating(star: number | null, event: MouseEvent) {
        // Optional: implement hover effect if you want
        this.hoverRating = star;
    }

    getStarType(star: number): 'full' | 'half' | 'empty' {
        const rating = this.hoverRating !== null ? this.hoverRating : this.courseForm.get('rating')?.value || 0;
        if (rating >= star) {
            return 'full';
        } else if (rating >= star - 0.5) {
            return 'half';
        } else {
            return 'empty';
        }
    }

    // Called when Trix editor changes
    onTrixChange(event: any) {
        // Always get the latest HTML from the editor
        const trixEditor = event.target;
        const value = trixEditor.editor.getDocument().toString().trim() === '' ? '' : trixEditor.innerHTML;
        this.courseForm.get('course_info')?.setValue(value);
    }

    // Optional: If you want to handle ngModelChange as well
    onTrixModelChange(value: string) {
        this.courseForm.get('course_info')?.setValue(value);
    }

    onStarClick(event: MouseEvent, star: number) {
        const { left, width } = (event.target as HTMLElement).getBoundingClientRect();
        const x = event.clientX - left;
        const isHalf = x < width / 2;
        const value = isHalf ? star - 0.5 : star;
        this.setRating(value);
    }

    onStarHover(event: MouseEvent, star: number) {
        const { left, width } = (event.target as HTMLElement).getBoundingClientRect();
        const x = event.clientX - left;
        const isHalf = x < width / 2;
        this.hoverRating = isHalf ? star - 0.5 : star;
    }

    // TinyMCE config (optional, for toolbar etc.)
    public tinymceConfig = {
        height: 200,
        menubar: false,
        plugins: 'lists link image table code',
        toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | removeformat | code'
    };
}
