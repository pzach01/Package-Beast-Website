import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
  goHome() {
    this.router.navigate(['/']);
  }
  goToPricing() {
    this.router.navigate(['/pricing']);
  }
  goToFeatures() {
    this.router.navigate(['/features']);
  }
}
