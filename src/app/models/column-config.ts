export type ColumnConfig = {
  columnDef: string;
  header: string;
  cell: (row: any) => string;
};

export const SwapiColumnConfigs: Record<string, ColumnConfig[]> = {
  people: [
    { columnDef: 'id', header: 'Id', cell: (row) => row.id },
    { columnDef: 'name', header: 'Name', cell: (row) => row.name },
    {
      columnDef: 'birth_year',
      header: 'Birth Year',
      cell: (row) => row.birth_year,
    },
    {
      columnDef: 'eye_color',
      header: 'Eye Color',
      cell: (row) => row.eye_color,
    },
    { columnDef: 'gender', header: 'Gender', cell: (row) => row.gender },
    {
      columnDef: 'hair_color',
      header: 'Hair Color',
      cell: (row) => row.hair_color,
    },
    { columnDef: 'height', header: 'Height', cell: (row) => row.height },
    { columnDef: 'mass', header: 'Mass', cell: (row) => row.mass },
    {
      columnDef: 'skin_color',
      header: 'Skin Color',
      cell: (row) => row.skin_color,
    },
  ],
  films: [
    { columnDef: 'id', header: 'Id', cell: (row) => row.id },
    { columnDef: 'title', header: 'Title', cell: (row) => row.title },
    {
      columnDef: 'episode_id',
      header: 'Episode Id',
      cell: (row) => row.episode_id,
    },
    { columnDef: 'director', header: 'Director', cell: (row) => row.director },
    { columnDef: 'producer', header: 'Producer', cell: (row) => row.producer },
    {
      columnDef: 'release_date',
      header: 'Release Date',
      cell: (row) => row.release_date,
    },
  ],
  planets: [
    { columnDef: 'id', header: 'Id', cell: (row) => row.id },
    { columnDef: 'name', header: 'Name', cell: (row) => row.name },
    { columnDef: 'diameter', header: 'Diameter', cell: (row) => row.diameter },
    {
      columnDef: 'rotation_period',
      header: 'Rotation Period',
      cell: (row) => row.rotation_period,
    },
    {
      columnDef: 'orbital_period',
      header: 'Orbital Period',
      cell: (row) => row.orbital_period,
    },
    { columnDef: 'gravity', header: 'Gravity', cell: (row) => row.gravity },
    {
      columnDef: 'population',
      header: 'Population',
      cell: (row) => row.population,
    },
    { columnDef: 'climate', header: 'Climate', cell: (row) => row.climate },
  ],
  species: [
    { columnDef: 'id', header: 'Id', cell: (row) => row.id },
    { columnDef: 'name', header: 'Title', cell: (row) => row.name },
    {
      columnDef: 'classification',
      header: 'Classification',
      cell: (row) => row.classification,
    },
    {
      columnDef: 'designation',
      header: 'Designation',
      cell: (row) => row.designation,
    },
    {
      columnDef: 'average_height',
      header: 'Average Height',
      cell: (row) => row.average_height,
    },
    {
      columnDef: 'average_lifespan',
      header: 'Average Lifespan',
      cell: (row) => row.average_lifespan,
    },
    { columnDef: 'language', header: 'Language', cell: (row) => row.language },
  ],
  starships: [
    { columnDef: 'id', header: 'Id', cell: (row) => row.id },
    { columnDef: 'name', header: 'Name', cell: (row) => row.name },
    {
      columnDef: 'manufacturer',
      header: 'Manufacturer',
      cell: (row) => row.manufacturer,
    },
    { columnDef: 'model', header: 'Model', cell: (row) => row.model },
    {
      columnDef: 'starship_class',
      header: 'Class',
      cell: (row) => row.starship_class,
    },
    { columnDef: 'MGLT', header: 'MGLT', cell: (row) => row.MGLT },
  ],
  vehicles: [
    { columnDef: 'id', header: 'Id', cell: (row) => row.id },
    { columnDef: 'name', header: 'Name', cell: (row) => row.name },
    {
      columnDef: 'manufacturer',
      header: 'Manufacturer',
      cell: (row) => row.manufacturer,
    },
    { columnDef: 'model', header: 'Model', cell: (row) => row.model },
    {
      columnDef: 'vehicle_class',
      header: 'Class',
      cell: (row) => row.vehicle_class,
    },
    { columnDef: 'length', header: 'Length', cell: (row) => row.length },
  ],
};
