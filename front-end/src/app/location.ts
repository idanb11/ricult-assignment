export interface Location {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  name: string;
  location: number[];
  _source: { name: string; location: number[] };
}
