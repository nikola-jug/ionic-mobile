import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Browser } from '@capacitor/browser';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProfileData } from '../domain/profile';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly profile = signal<ProfileData | null>(null);
  private loaded = false;

  // Returns the cached profile on subsequent calls — no extra HTTP request.
  // A null result means unauthenticated; the authGuard will redirect to home.
  loadProfile(): Observable<ProfileData | null> {
    if (this.loaded) {
      return of(this.profile());
    }
    return this.http.get<ProfileData>(`${environment.bffBaseUrl}/api/profile`).pipe(
      tap((data) => {
        this.profile.set(data);
        this.loaded = true;
      }),
      catchError(() => {
        this.loaded = true;
        return of(null);
      }),
    );
  }

  // Exchanges a short-lived one-time code (received via deep link after login) for a
  // session cookie. The BFF validates the code, deletes it, sets Set-Cookie in the
  // response, and returns profile data directly — avoiding a follow-up /api/profile
  // request that WKWebView may fire before the cross-origin cookie is stored.
  exchangeSession(code: string): Observable<ProfileData | null> {
    return this.http.post<ProfileData>(`${environment.bffBaseUrl}/session/exchange`, { code }).pipe(
      tap((profile) => {
        this.profile.set(profile);
        this.loaded = true;
      }),
      catchError(() => of(null)),
    );
  }

  // Clears local state and opens the BFF logout URL in the external browser.
  // On Android, Chrome holds the BFF session cookie (set during the login OAuth2 flow) and
  // will send it to the BFF, allowing OidcClientInitiatedLogoutSuccessHandler to redirect
  // through the IdP end-session endpoint. The IdP redirects to myapp://callback (no code),
  // which fires appUrlOpen and navigates the app home.
  // On iOS, SFSafariViewController does not fire appUrlOpen for myapp:// redirects, so we
  // listen for browserFinished instead and navigate home when the browser closes.
  logout(): void {
    this.clearProfile();
    Browser.open({ url: `${environment.bffBrowserUrl}/logout` });
  }

  clearProfile(): void {
    this.profile.set(null);
    this.loaded = false;
  }
}
