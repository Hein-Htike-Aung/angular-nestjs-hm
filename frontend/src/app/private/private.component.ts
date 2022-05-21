import { Component, OnInit } from '@angular/core';
import { map, share, Subscription, timer } from 'rxjs';

declare var $: any;
@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss'],
})
export class PrivateComponent implements OnInit {
  openSideBar = true;
  date: Date = new Date();

  constructor() {}

  time = new Date();
  intervalId: any;
  subscription: Subscription;

  toggleEmployeesMenu() {
    $('.employee-sub-menu').slideToggle('show');
    $('.employee-spinner').toggleClass('rotate');
  }

  toggleProductsMenu() {
    $('.product-sub-menu').slideToggle('show');
    $('.product-spinner').toggleClass('rotate');
  }

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);    
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
