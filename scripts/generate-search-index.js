import lunr from 'lunr';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = join(__dirname, '../src/files/bardicNames.json');
const outputPath = join(__dirname, '../src/data/search-index.json');

const BATCH_SIZE = 1000;

// Field cleaning functions
function cleanString(str) {
  if (!str) return 'Unknown';
  return str.trim().replace(/\s+/g, ' '); // Remove extra spaces
}

function validateJson(data) {
  if (!Array.isArray(data)) {
    throw new Error('Invalid data format: expected array');
  }

  // Check if JSON is well-formed
  try {
    JSON.stringify(data);
  } catch (e) {
    throw new Error('Invalid JSON format: ' + e.message);
  }

  return true;
}

function isEmptyRecord(record) {
  if (!record || typeof record !== 'object') return true;
  
  const requiredFields = [
    'Surname',
    'FIRST NAMES',
    'BARDIC NAMES',
    'TOWN VILLAGE',
    'DATE ADMITTED'
  ];
  
  // Check if all required fields are empty
  return requiredFields.every(field => !record[field] || record[field].trim() === '');
}

function cleanRecord(record) {
  if (!record || typeof record !== 'object') return null;

  return {
    Surname: cleanString(record.Surname),
    "FIRST NAMES": cleanString(record["FIRST NAMES"]),
    TITLE: cleanString(record.TITLE),
    "BARDIC NAMES": cleanString(record["BARDIC NAMES"]),
    "TOWN VILLAGE": cleanString(record["TOWN VILLAGE"]),
    "DATE ADMITTED": cleanString(record["DATE ADMITTED"]),
    "EXAM or HONORARY": cleanString(record["EXAM or HONORARY"]),
    "TYPE OF MEMEBERSHIP": cleanString(record["TYPE OF MEMEBERSHIP"]),
    SOURCE: cleanString(record.SOURCE),
    "ANY OTHER INFO": cleanString(record["ANY OTHER INFO"])
  };
}

function generateSearchIndex() {
  try {
    // Read and parse data
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    // Validate JSON structure
    validateJson(data);

    // Clean and filter data
    const cleanedData = data
      .filter(record => !isEmptyRecord(record))
      .map(cleanRecord)
      .filter(Boolean); // Remove any null records

    // Create index
    const idx = lunr(function() {
      this.ref('id');
      this.field('surname');
      this.field('firstName');
      this.field('bardicName');
      this.field('town');
      this.field('date');
      
      let batch = [];
      
      cleanedData.forEach((doc, index) => {
        batch.push({
          id: index.toString(),
          surname: doc.Surname,
          firstName: doc["FIRST NAMES"],
          bardicName: doc["BARDIC NAMES"],
          town: doc["TOWN VILLAGE"],
          date: doc["DATE ADMITTED"]
        });

        if (batch.length === BATCH_SIZE) {
          batch.forEach(item => this.add(item));
          batch = [];
        }
      });

      // Add remaining items
      batch.forEach(item => this.add(item));
    });

    // Write cleaned data and index
    fs.writeFileSync(
      join(__dirname, '../src/files/bardicNames.json'), 
      JSON.stringify(cleanedData, null, 2)
    );
    fs.writeFileSync(outputPath, JSON.stringify(idx));

    console.log('Search index generated successfully');
    console.log(`Processed ${cleanedData.length} records`);
    console.log(`Skipped ${data.length - cleanedData.length} empty records`);

  } catch (error) {
    console.error('Failed to generate search index:', error);
    process.exit(1);
  }
}

generateSearchIndex();