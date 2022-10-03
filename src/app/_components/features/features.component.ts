import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  goToRegister() {
    this.router.navigate(['/register']);
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
  goToPricing() {
    this.router.navigate(['/pricing']);
  }
  goToFeatures() {
    this.router.navigate(['/features']);
  }
  goHome() {
    this.router.navigate(['/']);
  }


}
