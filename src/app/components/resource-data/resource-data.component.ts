import { Component, input, InputSignal, OnInit } from '@angular/core';
import { SwapiResourceType } from '../../models/swapi-resource-map';

@Component({
  selector: 'app-resource-data',
  imports: [],
  templateUrl: './resource-data.component.html',
  styleUrl: './resource-data.component.scss',
})
export class ResourceDataComponent implements OnInit {
  public readonly data: InputSignal<any | undefined> = input<any | undefined>(
    {}
  );
  public readonly resourceType: InputSignal<SwapiResourceType> =
    input<SwapiResourceType>('people');

  public readonly selectedTabName: InputSignal<string> = input<string>('');

  public constructor() {}

  public ngOnInit(): void {
    console.log('Selected Tab Name: ', this.selectedTabName());
  }
}
