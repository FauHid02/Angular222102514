import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private renderer: Renderer2) {
    this.renderer.addClass(document.body, 'login-page');
  }
  nim = '212102428';
  name = 'Endricho';
}
