import { CacheInterceptor } from "./cache.interceptor";
import { HttpBackend, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { MemoryStorage } from './memory.store';

class HttpHandlerStub implements HttpHandler {
    handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
        return of(new HttpResponse({body: 'stub'}));
    }
}

fdescribe('CacheInterceptor', () => {
    let interceptor;
    beforeEach(() => {
        interceptor = new CacheInterceptor(new MemoryStorage());
    });
   it('should create', () => {
       expect(interceptor).toBeTruthy();
   });

   it('should call storage and return foo', () => {
        const cacheGetSpy = spyOn(interceptor.cache, 'getItem').and.returnValue('foo');
        const cacheSetSpy = spyOn(interceptor.cache, 'setItem');
        const actual$ = interceptor.intercept(new HttpRequest('GET', '/foo'), new HttpHandlerStub());
        
        expect(cacheGetSpy).toHaveBeenCalledTimes(1);
        expect(cacheSetSpy).not.toHaveBeenCalled();
        actual$.subscribe(response => expect(response.body).toEqual('foo'));
   });

   it('should call next handler if no cache value', () => {
        const cacheGetSpy = spyOn(interceptor.cache, 'getItem').and.returnValue(null);
        const cacheSetSpy = spyOn(interceptor.cache, 'setItem');
        const actual$ = interceptor.intercept(new HttpRequest('GET', '/foo'), new HttpHandlerStub());

        expect(cacheGetSpy).toHaveBeenCalledTimes(1);
        actual$.subscribe(response => {
            expect(response.body).toEqual('stub');
            expect(cacheSetSpy).toHaveBeenCalledTimes(1);
        });
   });
});