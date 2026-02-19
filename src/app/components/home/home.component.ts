import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export default class HomeComponent {
  public constructor() {}
}
