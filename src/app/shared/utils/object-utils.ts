import { SwapiResourceType } from '../../models/swapi-resource-map';

export function hasNameProperty(
  resource: SwapiResourceType
): resource is Extract<
  SwapiResourceType,
  'people' | 'planets' | 'species' | 'starships' | 'vehicles'
> {
  return ['people', 'planets', 'species', 'starships', 'vehicles'].includes(
    resource
  );
}
