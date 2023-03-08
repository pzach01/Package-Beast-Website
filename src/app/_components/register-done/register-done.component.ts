import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare let gtag: Function;

@Component({
  selector: 'app-register-done',
  templateUrl: './register-done.component.html',
  styleUrls: ['./register-done.component.scss']
})
export class RegisterDoneComponent implements OnInit {

  constructor(public router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'UA-111683104-2',
          {
            'page_path': event.urlAfterRedirects
          }
        );
        gtag('config', 'AW-445804472'),
        {
          'page_path': event.urlAfterRedirects
        };
      }
    })
  }

  ngOnInit(): void {
  }

}
