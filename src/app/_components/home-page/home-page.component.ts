import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { faFacebookSquare, faTwitterSquare, faYoutubeSquare } from '@fortawesome/free-brands-svg-icons'


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  faFacebookSquare = faFacebookSquare;
  faTwitterSquare = faTwitterSquare;
  faYoutubeSquare = faYoutubeSquare;
  animatecompbox = false;
  animaterenderingimage = false;

  constructor(private router: Router) { }

  @ViewChild('compwithbox') compwithbox: ElementRef;
  @ViewChild('renderingimage1') renderingimage1: ElementRef;
  ngOnInit(): void {

    document.addEventListener('wheel', (e) => {
      if (this.isElementInViewport(this.compwithbox.nativeElement)) {
        this.animatecompbox = true
      }
      if (this.isElementInViewport(this.renderingimage1.nativeElement)) {
        this.animaterenderingimage = true
      }
    });
  }

  isElementInViewport(el) {

    var rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
    );
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
