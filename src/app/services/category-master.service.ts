import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../models/categoryModel';

@Injectable({
  providedIn: 'root'
})
export class CategoryMasterService {

  private baseURL = `${environment.apiUrl}/category`;  
  
    constructor(private http: HttpClient) { }
     
    // Create a new Category
    createCategory(categoryModel: Category): Observable<any> {
      return this.http.post(`${this.baseURL}`, categoryModel);
    }
  
    // Get all Categories
    getCategory(): Observable<Category[]> {    
      console.log('Fetching all categories');
      return this.http.get<Category[]>(`${this.baseURL}`);
    }
  
    // Get a Category by ID
    getCategoryById(CategoryId: string): Observable<Category> {
      console.log('Fetching category with ID:', CategoryId);
      return this.http.get<Category>(`${this.baseURL}/${CategoryId}`);
    }
  
    // Update a Category by ID
    updateCategory(CategoryId: string, CategoryModel: Category): Observable<any> {
      return this.http.put(`${this.baseURL}/${CategoryId}`, CategoryModel);
    }
  
    // Delete a Category by ID
    deleteCategory(CategoryId: string): Observable<any> {
      console.log('Deleting category with ID:', CategoryId);
      return this.http.delete(`${this.baseURL}/${CategoryId}`);
    }
  }