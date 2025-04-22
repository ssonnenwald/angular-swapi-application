import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-resource-data',
  imports: [],
  templateUrl: './resource-data.component.html',
  styleUrl: './resource-data.component.scss',
})
export class ResourceDataComponent {
  public resource: InputSignal<string> = input<string>('');
  public resourceId: InputSignal<string> = input<string>('');

  public constructor() {}
}
