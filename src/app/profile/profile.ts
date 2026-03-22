import { Component, inject } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-profile',
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonNote, IonButton],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private readonly navCtrl = inject(NavController);
  private readonly authService = inject(AuthService);

  // Profile is guaranteed to be loaded by authGuard before this component renders.
  readonly profile = this.authService.profile;

  goToPayments(): void {
    this.navCtrl.navigateRoot('/payments');
  }

  logout(): void {
    this.authService.logout();
  }
}
