import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CategoryMasterService } from '../../../../services/category-master.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category-master',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './category-master.component.html',
  styleUrl: './category-master.component.css'
})
export class CategoryMasterComponent {
  ActiveTab = 'Add';
  categoryForm!: FormGroup;
  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  paginatedData: any[] = [];  
  categories: any[] = [];
  filteredCategories: any[] = [];
  selectedCategoryId: string | null = null;  
  sortColumn: string = '';
  sortDirection: boolean = true;
  



  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryMasterService,    
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    this.categoryForm = this.fb.group({
      CategoryId: ['0', Validators.required],
      CategoryName: ['', Validators.required],      
      Status: ["Active"], // Default to active
    });

    
    this.loadcategories();
  }

  changeActiveTab(tabName: string) {
    this.ActiveTab = tabName;
    if (tabName === 'Add') {
      this.resetForm();
      this.categoryForm.get('CourseId')?.setValue('0'); // Reset CourseId to '0'
    }
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.toastr.warning('Please fill all required fields.', 'Validation Error');
      return;
    }   

    if (this.selectedCategoryId) {
      const payload = {
        ...this.categoryForm.value,        
      };
      this.categoryService.updateCategory(this.selectedCategoryId, payload).subscribe({
        next: () => {
          this.toastr.success('Category updated successfully!', 'Success');
          this.resetForm();
          this.loadcategories();
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Failed to update category.', 'Error');
        },
      });
    } else {
      this.categoryService.createCategory({
        ...this.categoryForm.value,        
      }).subscribe({
        next: () => {
          this.toastr.success('Category created successfully!', 'Success');
          this.resetForm();
          this.loadcategories();
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Failed to create Category.', 'Error');
        },
      });
    }
  }

  

  loadcategories(): void {
    this.categoryService.getCategory().subscribe({
      next: (data) => {
        console.log(data);
        this.categories = data;
        this.filterData();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to load categories.', 'Error');
      }
    });
  }

  editModule(CategoryId: number): void {
    this.categoryService.getCategoryById(CategoryId.toString()).subscribe({
      next: (module) => {
        this.changeActiveTab('Add');
        this.selectedCategoryId = CategoryId.toString();

        this.categoryForm.patchValue({       
          CategoryId:module.CategoryId,    // Ensure CourseId is a string     
          CategoryName: module.CategoryName,          
          Status: module.Status, // <-- should be module.Status
        });
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to fetch Category details.', 'Error');
      }
    });
  }

  deleteModule(CategoryId: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.categoryService.deleteCategory(CategoryId.toString()).subscribe({
        next: () => {
          this.categoryService.getCategory().subscribe({
            next: (data) => {
              this.categories = data;
              this.filterData();
              this.toastr.success('Category deleted successfully!', 'Success');
            },
            error: (err) => {
              console.error(err);
              this.toastr.error('Failed to reload categories after delete.', 'Error');
            }
          });
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Failed to delete Category.', 'Error');
        }
      });
    }
  }

  filterData(): void {
    const search = this.searchText.toLowerCase();
    this.filteredCategories = this.categories.filter(category =>
      Object.values(category).some(value =>
        value !== null &&
        value !== undefined &&
        String(value).toLowerCase().includes(search)
      )
    );

    this.totalPages = Math.ceil(this.filteredCategories.length / this.itemsPerPage);
    this.goToPage(1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.filteredCategories.slice(startIndex, endIndex);
  }

  resetForm(): void {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    this.categoryForm.reset({
      CategoryId: '0', // or '0' if that's your default
      CategoryName: '',      
      Status: 'Active', // <-- Ensure Status is set
    });
    this.selectedCategoryId = null;
  }

  sortData(column: string): void {
    this.sortDirection = this.sortColumn === column ? !this.sortDirection : true;
    this.sortColumn = column;

    this.filteredCategories.sort((a, b) => {
      const valueA = a[column]?.toString().toLowerCase() || '';
      const valueB = b[column]?.toString().toLowerCase() || '';
      return this.sortDirection ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });

    this.goToPage(1);
  }

  setItemsPerPage(items: number | string): void {
    if (items === 'all') {
      this.itemsPerPage = this.filteredCategories.length; // Show all items
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

  
}
