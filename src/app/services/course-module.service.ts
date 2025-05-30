import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Course } from '../models/courseModel';
import { CourseModule } from '../models/courseModuleModel';

@Injectable({
  providedIn: 'root'
})
export class CourseModuleService {

  private baseURL = `${environment.apiUrl}/courseModule`;  

  constructor(private http: HttpClient) { }
   
  // Create a new Module
  createModule(CourseModule: CourseModule): Observable<any> {
    return this.http.post(`${this.baseURL}`, CourseModule);
  }

  // Get all Modules
  getModules(): Observable<CourseModule[]> {    
    console.log('Fetching all course modules');
    return this.http.get<CourseModule[]>(`${this.baseURL}`);
  }

  // Get a Module by ID
  getModuleById(ModuleId: string): Observable<CourseModule> {
    console.log('Fetching course with ID:', ModuleId);
    return this.http.get<CourseModule>(`${this.baseURL}/${ModuleId}`);
  }

  // Update a Module by ID
  updateModule(ModuleId: string, CourseModule: CourseModule): Observable<any> {
    return this.http.put(`${this.baseURL}/${ModuleId}`, CourseModule);
  }

  // Delete a Module by ID
  deleteModule(ModuleId: string): Observable<any> {
    console.log('Deleting course with ID:', ModuleId);
    return this.http.delete(`${this.baseURL}/${ModuleId}`);
  }
}
