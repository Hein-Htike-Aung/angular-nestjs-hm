import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private toastr: ToastrService) {}

  presentMessage(message: string) {
    this.toastr.error(message, 'Error occured', { timeOut: 2000 });
  }

  handleError<T>(result?: T): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {
      return of(result as T).pipe(
        tap(() => this.presentMessage(error.error.message))
      );
    };
  }
}
