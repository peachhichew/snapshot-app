import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
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
  // declare a subscription object so that we can use it for attaching events 
  private subscription: Subscription;

  constructor(public platform: Platform,
    private SQLProvider: SQLiteProvider,
    private router: Router) { }


  public async ngOnInit(): Promise<void> {
    await this.onEnter();

    // when the navigation from the previous page is ending, with the target
    // of the router event being the uploaded page, call the onEnter function
    // prior to loading the rest of the page
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url === '/tabs/(uploaded:uploaded)') {
        this.onEnter();
      }
    });
  }

  // once "uploaded" becomes the active page, we want to grab all the food we've uploaded before
  // from the database
  public async onEnter(): Promise<void> {
    this.SQLProvider.getRecentFood();
  }

  // when the component is destroyed by Angular, remove the subscription object.
  // the object links to the navigation to this page, allowing it to repeat the next time
  // without having the event run twice
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
