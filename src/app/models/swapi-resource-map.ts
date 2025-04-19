import { Film } from './film';
import { Person } from './person';
import { Planet } from './planet';
import { Species } from './species';
import { Starship } from './starship';
import { Vehicle } from './vehicle';

export type SwapiResourceMap = {
  films: Film;
  people: Person;
  planets: Planet;
  species: Species;
  starships: Starship;
  vehicles: Vehicle;
};

export type SwapiResourceType = keyof SwapiResourceMap;
