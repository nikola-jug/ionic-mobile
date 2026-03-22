import { Component, inject, NgZone, OnInit } from '@angular/core';
import { App as CapacitorApp } from '@capacitor/app';
import { IonApp, IonRouterOutlet, NavController } from '@ionic/angular/standalone';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [IonApp, IonRouterOutlet],
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly navCtrl = inject(NavController);
  private readonly authService = inject(AuthService);
  private readonly zone = inject(NgZone);

  ngOnInit(): void {
    // appUrlOpen callbacks run outside Angular's NgZone — wrap in zone.run() so that
    // HTTP requests, router navigation, and change detection all work correctly.
    CapacitorApp.addListener('appUrlOpen', ({ url }) =>
      this.zone.run(() => {
        const parsed = new URL(url);
        const code = parsed.searchParams.get('code');

        console.log('[appUrlOpen] url:', url, 'code:', code);

        if (code) {
          this.authService.exchangeSession(code).subscribe({
            next: (profile) => {
              console.log('[appUrlOpen] exchange ok, profile:', profile);
              if (profile) this.navCtrl.navigateRoot('/profile');
            },
            error: (err) => console.error('[appUrlOpen] exchange failed:', err),
          });
        } else {
          // Logout callback: navigate home, loadProfile() will return null naturally.
          this.navCtrl.navigateRoot('/');
        }
      }),
    );
  }
}
