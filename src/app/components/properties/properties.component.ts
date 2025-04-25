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
  public readonly data: InputSignal<any | undefined> = input<any | undefined>(
    {}
  );
  public readonly resourceType: InputSignal<SwapiResourceType> =
    input<SwapiResourceType>('people');

  public swapi: SwapiService = inject(SwapiService);

  public displayProperties: Signal<{ key: string; value: string }[]> = computed(
    () => this.getDisplayProperties(this.resourceType(), this.data())
  );

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
    const results = this.swapi.typedResourceData()?.results;

    if (!results?.length || !resource || !hasNameProperty(resource))
      return undefined;

    const first = results[0];
    return typeof first === 'object' && 'name' in first
      ? String(first.name)
      : undefined;
  });

  public constructor() {
    effect(() => {
      const parts = this.homeworldUrlParts();

      if (!parts) return;

      this.swapi.resource.set(parts.resource);
      this.swapi.resourceIds.set([parts.id]);
    });
  }

  private formatKey(key: string): string {
    return key
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

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
