export interface BardicRecord {
  Surname: string;
  "FIRST NAMES": string;
  TITLE: string;
  "BARDIC NAMES": string;
  "TOWN VILLAGE": string;
  "DATE ADMITTED": string;
  "EXAM or HONORARY": string;
  "TYPE OF MEMEBERSHIP": string;
  SOURCE: string;
  "ANY OTHER INFO": string;
}

// Import data from public JSON file
import bardicNamesData from '/dist/data/BardicNames.json';
export const bardicNames: BardicRecord[] = bardicNamesData;