import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpResponse, HttpInterceptor, HttpHandler } from '@angular/common/http';
import { MemoryStorage } from './memory.store';
import { tap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  constructor(private cache: MemoryStorage) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const cachedResponseBody = this.cache.getItem(req.url);
    if (cachedResponseBody) {
        return of(new HttpResponse({body: cachedResponseBody}));
    }
    return next.handle(req).pipe(
        map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                this.cache.setItem(req.url, event.body);
            }
            return event;
        }));
  }
}