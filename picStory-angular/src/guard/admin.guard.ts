import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const adminGuard = () => {

  const router = inject(Router);

  const token = typeof window !== 'undefined'
    ? localStorage.getItem('token')
    : null;

  if (token) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};