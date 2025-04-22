import { Component, input, InputSignal } from '@angular/core';
import {
  SwapiResourceMap,
  SwapiResourceType,
} from '../../models/swapi-resource-map';
import { resourceDisplayOrder } from '../../models/swapi-display-order';

@Component({
  selector: 'app-properties',
  imports: [],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss',
})
export class PropertiesComponent {
  // public resource: InputSignal<string> = input<string>('');
  // public resourceId: InputSignal<string> = input<string>('');
  public data: InputSignal<any | undefined> = input<any | undefined>({});
  public resourceType: InputSignal<SwapiResourceType> =
    input<SwapiResourceType>('people');

  public constructor() {}

  private formatKey(key: string): string {
    return key
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  public getDisplayProperties<T extends SwapiResourceType>(
    resourceType: T,
    obj: SwapiResourceMap[T]
  ): { key: string; value: string }[] {
    const orderedKeys = resourceDisplayOrder[resourceType];
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'long',
      timeStyle: 'long',
    });

    return orderedKeys
      .filter((key) => {
        const value = obj[key];
        return !Array.isArray(value) && key !== 'url';
      })
      .map((key) => {
        const rawValue = obj[key];
        let valueStr: string;

        if (
          (key === 'created' || key === 'edited') &&
          typeof rawValue === 'string'
        ) {
          const date = new Date(rawValue);
          valueStr = isNaN(date.getTime())
            ? rawValue
            : dateFormatter.format(date);
        } else {
          valueStr = String(rawValue);
        }

        return {
          key: this.formatKey(key as string),
          value: valueStr,
        };
      });
  }
}
