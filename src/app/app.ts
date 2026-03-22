import { Component, inject, NgZone, OnInit } from '@angular/core';
import { App as CapacitorApp } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
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

        // Close SFSafariViewController on iOS — it does not auto-close on custom URL schemes.
        // On Android the Chrome Custom Tab is already gone when appUrlOpen fires, so
        // calling Browser.close() there can cause a spurious activity resume that
        // re-shows the home screen and fires a second appUrlOpen with no code.
        if (Capacitor.getPlatform() === 'ios') {
          Browser.close();
        }

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
