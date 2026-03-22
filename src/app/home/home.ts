import { Component, inject, OnInit } from '@angular/core';
import { Browser } from '@capacitor/browser';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  NavController,
} from '@ionic/angular/standalone';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private readonly navCtrl = inject(NavController);
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.loadProfile().subscribe((profile) => {
      if (profile) this.navCtrl.navigateRoot('/profile');
    });
  }

  loginWithKeycloak(): void {
    this.startOAuth(`${environment.bffBrowserUrl}/oauth2/authorization/keycloak`);
  }

  loginWithAuthServer(): void {
    this.startOAuth(`${environment.bffBrowserUrl}/oauth2/authorization/auth-server`);
  }

  private startOAuth(url: string): void {
    Browser.open({ url });
  }
}
