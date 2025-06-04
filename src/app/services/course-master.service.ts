import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Course } from '../models/courseModel';

@Injectable({
  providedIn: 'root'
})
export class CourseMasterService {

  private baseURL = `${environment.apiUrl}/course`;

  constructor(private http: HttpClient) {}

  // Create a new course
  createCourse(course: Course): Observable<any> {
    return this.http.post(`${this.baseURL}`, course);
  }

  // Get all courses
  getCourses(): Observable<Course[]> {    
    return this.http.get<Course[]>(`${this.baseURL}`);
  }

  // Get a course by ID
  getCourseById(courseId: string): Observable<Course> {
    console.log('Fetching course with ID:', courseId);
    return this.http.get<Course>(`${this.baseURL}/${courseId}`);
  }

  // Update a course by ID
  updateCourse(courseId: string, course: Course): Observable<any> {
    return this.http.put(`${this.baseURL}/${courseId}`, course);
  }

  // Delete a course by ID
  deleteCourse(courseId: string): Observable<any> {
    console.log('Deleting course with ID:', courseId);
    return this.http.delete(`${this.baseURL}/${courseId}`);
  }

  // Upload banner image
  uploadBannerImage(file: File): Observable<{ path: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ path: string }>(`${environment.apiUrl}/upload`, formData);
  }
}
