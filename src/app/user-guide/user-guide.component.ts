import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss']
})
export class UserGuideComponent implements OnInit {

  isIos: boolean = false;
  screenSmallOrXs: boolean = false;
  constructor() { }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenSmallOrXs = this.isSmallOrXsScreen();
  }

  ngOnInit(): void {
    this.isIos = this.isIOS()
    this.screenSmallOrXs = this.isSmallOrXsScreen()
  }

  isSmallOrXsScreen(): boolean {
    if (window.innerWidth < 768) { return true }
  }

  isIOS() {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform)
      // iPad on iOS 13 detection
      || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  }
}
