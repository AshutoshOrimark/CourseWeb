import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CourseProgress } from '../models/courseProgressModel';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseProgressService {

  private apiUrl = `${environment.apiUrl}/api/courseProgress`;

  constructor(private http: HttpClient) {}

  getCourseProgress(courseId: number): Observable<CourseProgress[]> {
    const url = `${this.apiUrl}/course-progress/?course_id=${courseId}`;
    return this.http.get<CourseProgress[]>(url);
  }
}
