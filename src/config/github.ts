import { HttpHeaders } from '@angular/common/http';

export const github = {
    baseUrl: 'https://api.github.com',
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 6ba278712f38dc6b05d8ac4c2203b4f4b107e48e'
      })
};