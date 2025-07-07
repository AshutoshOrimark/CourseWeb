import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  const apiUrl = environment.apiUrl;

  // Normalize URLs for comparison
  const isApiRequest =
    req.url.startsWith(apiUrl) ||
    req.url.startsWith('/api') || // If you use relative URLs in dev
    req.url.includes(window.location.hostname); // For same-origin requests

  // Only add Authorization header for your API and non-OPTIONS requests
  if (
    token &&
    isApiRequest &&
    req.method !== 'OPTIONS'
  ) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  }
  return next(req);
};