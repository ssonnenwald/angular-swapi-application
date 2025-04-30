import {
  Component,
  computed,
  effect,
  inject,
  input,
  InputSignal,
  Signal,
} from '@angular/core';
import {
  SwapiResourceMap,
  SwapiResourceType,
} from '../../models/swapi-resource-map';
import { resourceDisplayOrder } from '../../models/swapi-display-order';
import { getIdFromUrl, getResourceFromUrl } from '../../shared/utils/url-utils';
import { RouterLink } from '@angular/router';
import { SwapiService } from '../../services/swapi/swapi.service';
import { hasNameProperty } from '../../shared/utils/object-utils';

@Component({
  selector: 'app-properties',
  imports: [RouterLink],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss',
  providers: [SwapiService],
})
export class PropertiesComponent {
  public data: InputSignal<any | undefined> = input<any | undefined>({});
  public resourceType: InputSignal<SwapiResourceType> =
    input<SwapiResourceType>('people');

  private swapi: SwapiService = inject(SwapiService);

  /**
   * Computes the properties of the resource as an array of objects with `key` and `value` properties.
   *
   * @returns An array of objects containing the key and value of the properties of the resource.
   */
  public displayProperties: Signal<{ key: string; value: string }[]> = computed(
    () => this.getDisplayProperties(this.resourceType(), this.data())
  );

  /**
   * Computes the homeworld URL parts from the component's data.
   * If the homeworld URL is present, extracts the resource type and ID.
   *
   * @returns An object containing the resource type and ID if available, otherwise undefined.
   */
  public homeworldUrlParts = computed(() => {
    const homeworldUrl = this.data()?.homeworld;

    if (!homeworldUrl) return undefined;

    return {
      resource: getResourceFromUrl(homeworldUrl) as SwapiResourceType,
      id: getIdFromUrl(homeworldUrl),
    };
  });

  public homeworldName: Signal<string | undefined> = computed(() => {
    const resource = this.homeworldUrlParts()?.resource;
    const results = this.swapi.resourceData.value()?.results;

    if (!results?.length || !resource || !hasNameProperty(resource))
      return undefined;

    const first = results[0];
    return typeof first === 'object' && 'name' in first
      ? String(first.name)
      : undefined;
  });

  /**
   * Initializes the PropertiesComponent by setting up a reactive effect.
   * This effect updates the SwapiService's resource and resourceIds based
   * on the homeworld URL parts extracted from the component's data.
   */

  public constructor() {
    effect(() => {
      const parts = this.homeworldUrlParts();

      if (!parts) return;

      this.swapi.resource = parts.resource;
      this.swapi.resourceIds.set([parts.id]);
    });
  }

  /**
   * Given a string, split it by underscores and capitalize the first letter of each segment, then join them back together.
   * @example
   * formatKey('foo_bar') // 'Foo Bar'
   * @param key The string to format.
   * @returns The formatted string.
   */
  private formatKey(key: string): string {
    return key
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Returns an array of { key: string, value: string } objects, where `key` is the formatted version of the original key and `value` is the formatted version of the value of the corresponding property on `obj`.
   * @param resourceType The type of the resource.
   * @param obj The object to extract properties from.
   * @returns An array of { key: string, value: string } objects.
   */
  private getDisplayProperties<T extends SwapiResourceType>(
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
