import { parse } from 'csv-parse';
import fs from 'fs/promises';
import { createReadStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Enhanced logging function
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌ ERROR:' : '📝 INFO:';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const CSV_PATH = join(__dirname, '../data/input/bardic-data.csv');
const OUTPUT_PATH = join(__dirname, '../src/files/bardicNames.json');

log(`Script starting...`);
log(`CSV Path: ${CSV_PATH}`);
log(`Output Path: ${OUTPUT_PATH}`);

// Field mapping from CSV to JSON
const FIELD_MAPPING = {
  'surname': 'Surname',
  'first_names': 'FIRST NAMES',
  'title': 'TITLE',
  'bardic_names': 'BARDIC NAMES',
  'town_village': 'TOWN VILLAGE',
  'date_admitted': 'DATE ADMITTED',
  'exam_or_honorary': 'EXAM or HONORARY',
  'type_of_membership': 'TYPE OF MEMEBERSHIP',
  'source': 'SOURCE',
  'additional_info': 'ANY OTHER INFO'
};

// Data cleaning functions
function cleanString(str) {
  if (!str) return 'Unknown';
  return str.trim()
    .replace(/\s+/g, ' ') // Remove extra spaces
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); // Remove control characters
}

function cleanDate(date) {
  if (!date) return 'Unknown';
  return date.trim();
}

function validateRecord(record) {
  // Require at least one identifying field
  return record.Surname || 
         record['FIRST NAMES'] || 
         record['BARDIC NAMES'] ||
         record['TOWN VILLAGE'];
}

async function processCSV() {
  try {
    // Create input directory if it doesn't exist
    const inputDir = join(__dirname, '../data/input');
    const outputDir = dirname(OUTPUT_PATH);
    await fs.mkdir(inputDir, { recursive: true });
    await fs.mkdir(outputDir, { recursive: true });
    
    log('Starting CSV processing...');

    // Check if CSV exists
    try {
      await fs.access(CSV_PATH);
      log('CSV file found');
      
      // Check file size
      const stats = await fs.stat(CSV_PATH);
      log(`CSV file size: ${stats.size} bytes`);
      
      if (stats.size === 0) {
        throw new Error('CSV file is empty');
      }
    } catch (error) {
      log(`CSV file error: ${error.message}`, 'error');
      log(`Please ensure CSV file exists at: ${CSV_PATH}`, 'error');
      log('Expected CSV headers: ' + Object.keys(FIELD_MAPPING).join(', '), 'error');
      process.exit(1);
    }

    const records = [];
    let processed = 0;
    let skipped = 0;
    let hasError = false;

    // Process CSV
    const parser = createReadStream(CSV_PATH)
      .pipe(parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
        bom: true // Handle BOM if present
      }))
      .on('error', (error) => {
        log(`Parser error: ${error.message}`, 'error');
        hasError = true;
      })
      .on('skip', (error) => {
        log(`Skipped line: ${error.message}`, 'error');
        skipped++;
      });

    for await (const row of parser) {
      processed++;
      
      // Debug CSV data
      if (processed === 1) {
        log(`First row headers: ${Object.keys(row).join(', ')}`);
        // Validate all expected fields exist
        Object.keys(FIELD_MAPPING).forEach(expectedField => {
          if (!row.hasOwnProperty(expectedField)) {
            log(`Missing expected field in CSV: "${expectedField}"`, 'error');
          }
        });
      }
      
      // Map and clean fields
      const record = {
        id: uuidv4(),
        ...Object.entries(FIELD_MAPPING).reduce((acc, [csvField, jsonField]) => {
          const value = row[csvField] || '';
          acc[jsonField] = jsonField.includes('DATE') ? 
            cleanDate(value) : 
            cleanString(value);
          return acc;
        }, {})
      };

      // Validate record
      if (validateRecord(record)) {
        records.push(record);
        log(`Valid record processed: ${record.Surname || record['BARDIC NAMES'] || 'Unknown'}`);
      } else {
        skipped++;
        log(`Skipping invalid record: ${JSON.stringify(row)}`, 'error');
      }

      // Progress indicator
      if (processed % 100 === 0) {
        log(`Progress: ${processed} records processed`);
      }
    }

    if (hasError || processed === 0) {
      throw new Error('Failed to process CSV file correctly');
    }

    // Sort records by date (if possible) and surname
    records.sort((a, b) => {
      const dateA = a['DATE ADMITTED'];
      const dateB = b['DATE ADMITTED'];
      if (dateA !== dateB) return dateA.localeCompare(dateB);
      return a.Surname.localeCompare(b.Surname);
    });

    // Write output
    await fs.writeFile(
      OUTPUT_PATH,
      JSON.stringify(records, null, 2)
    );

    log('\nProcessing complete!');
    log(`Total records processed: ${processed}`);
    log(`Valid records: ${records.length}`);
    log(`Skipped records: ${skipped}`);
    log(`Output written to: ${OUTPUT_PATH}`);

  } catch (error) {
    log(`Fatal error: ${error.message}`, 'error');
    if (error.stack) {
      log(`Stack trace: ${error.stack}`, 'error');
    }
    process.exit(1);
  }
}

processCSV();