import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CourseMasterService } from '../../../../services/course-master.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-course-master',
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    templateUrl: './course-master.component.html',
    styleUrl: './course-master.component.css'
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


    constructor(
        private fb: FormBuilder,
        private courseService: CourseMasterService,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];
        this.courseForm = this.fb.group({
            course_name: ['', Validators.required],
            course_description: ['', Validators.required],
            video_path: ['', [Validators.required]],
            actual_price: [Validators.required],
            discounted_price: [Validators.required],
            discount_percentage: [0], // Initialize with a default value
            is_public: [false], // Default to false
        });

        this.loadCourses();
    }

    changeActiveTab(tabName: string) {
        this.ActiveTab = tabName;
        if (tabName === 'Add') this.resetForm();
    }

    onSubmit(): void {
        if (this.courseForm.invalid) {
            this.toastr.warning('Please fill all required fields.', 'Validation Error');
            return;
        }

        // Auto-calculate discount_percentage
        const actualPrice = this.courseForm.get('actual_price')?.value;
        const discountedPrice = this.courseForm.get('discounted_price')?.value;

        if (actualPrice && discountedPrice) {
            const discountPercentage = ((actualPrice - discountedPrice) / actualPrice) * 100;
            this.courseForm.patchValue({ discount_percentage: discountPercentage.toFixed(2) });
        }

        if (this.courseForm.valid) {
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
        } else {
            this.toastr.warning('Please fill all required fields.', 'Warning');
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

                this.courseForm.patchValue({
                    course_name: course.course_name,
                    course_description: course.course_description,
                    video_path: course.video_path,
                    actual_price: course.actual_price,
                    discounted_price: course.discounted_price,
                    discount_percentage: course.discount_percentage,
                    is_public: course.is_public,
                });
            },
            error: (err) => {
                console.error(err);
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
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];
        this.courseForm.reset({
            course_name: '',
            course_description: '',
            duration_in_weeks: '',
            start_date: formattedDate,
            end_date: formattedDate
        });
        this.selectedCourseId = null;
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
