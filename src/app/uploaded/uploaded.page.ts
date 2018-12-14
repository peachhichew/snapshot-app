import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, ToastController, LoadingController, Platform } from '@ionic/angular';
import { OnEnter } from '../on-enter';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { SQLiteProvider } from '../../providers/SQLiteProvider';

@Component({
  selector: 'app-uploaded',
  templateUrl: './uploaded.page.html',
  styleUrls: ['./uploaded.page.scss'],
})

export class UploadedPage implements OnInit, OnEnter, OnDestroy {

  private subscription: Subscription;

  constructor(public platform: Platform,
    private SQLProvider: SQLiteProvider,
    private router: Router) { }


  public async ngOnInit(): Promise<void> {
    await this.onEnter();

    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url === '/tabs/(uploaded:uploaded)') {
        this.onEnter();
      }
    });
  }

  public async onEnter(): Promise<void> {
    this.SQLProvider.getRecentFood();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
