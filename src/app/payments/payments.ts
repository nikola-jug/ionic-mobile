import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonTitle,
  IonToolbar,
  NavController,
} from '@ionic/angular/standalone';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { Payment } from '../domain/payment';

@Component({
  selector: 'app-payments',
  imports: [
    IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
    IonContent, IonList, IonItem, IonLabel, IonNote, IonButton,
  ],
  templateUrl: './payments.html',
  styleUrl: './payments.css',
})
export class Payments implements OnInit {
  private readonly navCtrl = inject(NavController);
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  readonly payments = signal<Payment[]>([]);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.http
      .get<Payment[]>(`${environment.bffBaseUrl}/api/payments`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.payments.set(data),
        error: (err) => {
          if (err.status === 403) {
            this.error.set('Payments require Keycloak authentication. Please sign in with Keycloak.');
          } else {
            this.error.set('Failed to load payments.');
          }
        },
      });
  }

  goToProfile(): void {
    this.navCtrl.navigateRoot('/profile');
  }

  logout(): void {
    this.authService.logout();
  }
}
