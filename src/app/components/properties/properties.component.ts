import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-properties',
  imports: [],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss',
})
export class PropertiesComponent {
  public resource: InputSignal<string> = input<string>('');
  public resourceId: InputSignal<string> = input<string>('');

  public constructor() {}
}
