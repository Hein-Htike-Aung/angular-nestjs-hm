import { TokenResponse } from './../models/token-response.model';
import { User } from './../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  from,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { environment } from '../../../environments/environment';
import { GetResult, Storage } from '@capacitor/storage';

import jwt_decode from 'jwt-decode';

const API_URL = `${environment.API}/auth`;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user$ = new BehaviorSubject<User>(null);

  private headerOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      'Content-Type': 'applicaion/json',
    }),
  };

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(`${API_URL}/login`, {
        username,
        password,
      })
      .pipe(
        take(1),
        tap((resp: { token: string }) => {
          localStorage.setItem('token', resp.token);

          const tokenResponse: TokenResponse = jwt_decode(resp.token);

          this.user$.next(tokenResponse.user);
        })
      );
  }

  isTokenInStorage(): Observable<boolean> {
    return of(localStorage.getItem('token')).pipe(
      map((token: string) => {
        if (!token) return null;

        const decodedToken: TokenResponse = jwt_decode(token);

        const jwtExpirationInMsSinceUnixEpoch = decodedToken.exp * 1000;

        const isExpired =
          new Date() > new Date(jwtExpirationInMsSinceUnixEpoch);

        if (isExpired) return null;

        this.user$.next(decodedToken.user);
        return true;
      })
    );
  }

  findUserWithUsername(username: string): Observable<User> {
    return this.http.get<User>(`${API_URL}/by-username/${username}`).pipe(take(1));
  }

  get isUserLoggedIn(): Observable<boolean> {
    return this.user$
      .asObservable()
      .pipe(switchMap((user: User) => of(user !== null)));
  }

  get loggedInUser(): Observable<User> {
    return this.user$.asObservable().pipe(take(1));
  }
}
