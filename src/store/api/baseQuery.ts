import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  
  prepareHeaders: (headers) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    console.log('API base URL:', process.env.NEXT_PUBLIC_API_URL)
    headers.set('Content-Type', 'application/json');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});
