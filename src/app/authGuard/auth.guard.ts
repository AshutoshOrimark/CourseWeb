import { Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';

export const AuthGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('access_token');
  return !!token; // Allow access if token exists
};