import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Course } from '../models/courseModel';
import { CourseModule, ModuleVideoRequest, ModuleVideoResponse } from '../models/courseModuleModel';

@Injectable({
  providedIn: 'root'
})

export class CourseModuleService {

  private baseURL = `${environment.apiUrl}/api/courseModule`;
  private baseURL1 = `${environment.apiUrl}/api/media`;

  constructor(private http: HttpClient) { }

  // Create a new Module
  createModule(CourseModule: CourseModule): Observable<any> {
    return this.http.post(`${this.baseURL}`, CourseModule);
  }

  // Get all Modules for a specific course
  getModules(courseId: number): Observable<CourseModule[]> {
    console.log('Fetching all course modules for courseId:', courseId);
    return this.http.get<CourseModule[]>(`${this.baseURL}?course_id=${courseId}`);
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

  // Get YouTube video duration
  getYoutubeDuration(url: string): Observable<{ duration: string }> {
    return this.http.post<{ duration: string }>(
      `${this.baseURL1}/getDailymotionDuration`,
      { url }
    );
  }

  // -------- Module Video Methods --------

  // Insert a new video into ModuleVideo table
  insertModuleVideo(videoData: ModuleVideoRequest): Observable<ModuleVideoResponse> {
    
    return this.http.post<ModuleVideoResponse>(`${this.baseURL}/moduleVideo/`, videoData);
  }

  // Get all videos for a given course and module
  getModuleVideos(courseId: number, moduleId: number): Observable<ModuleVideoResponse[]> {
    return this.http.get<ModuleVideoResponse[]>(`${this.baseURL}/moduleVideo/?course_id=${courseId}&module_id=${moduleId}`);
  }

  // Delete a video by its VideoId
  deleteModuleVideo(videoId: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/moduleVideo/${videoId}`);
  }
}
