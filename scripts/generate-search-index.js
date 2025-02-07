import lunr from 'lunr';
import fs from 'fs';
import path from 'path';
import { bardicNames } from '../dist/data/bardicNames.js';

// Create search index
const idx = lunr(function () {
  this.ref('id');
  this.field('surname');
  this.field('firstName');
  this.field('bardicName');
  this.field('town');
  this.field('date');
  
  bardicNames.forEach((doc, index) => {
    this.add({
      id: index.toString(),
      surname: doc.Surname || '',
      firstName: doc["FIRST NAMES"] || '',
      bardicName: doc["BARDIC NAMES"] || '',
      town: doc["TOWN VILLAGE"] || '',
      date: doc["DATE ADMITTED"] || ''
    });
  });
});

// Save the index to a JSON file
const indexJson = JSON.stringify(idx);
fs.writeFileSync(
  path.join(process.cwd(), 'src/data/search-index.json'),
  indexJson
);