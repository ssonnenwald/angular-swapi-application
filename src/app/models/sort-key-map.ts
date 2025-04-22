import { SwapiResourceType } from './swapi-resource-map';

export const SortKeyMap: Record<SwapiResourceType, string> = {
  people: 'name',
  films: 'title',
  planets: 'name',
  species: 'name',
  starships: 'name',
  vehicles: 'name',
};
