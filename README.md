# Bardic: Welsh Bards Database

Bardic is a web application providing access to the National Library of Wales' Bardic Names dataset. It offers insights into Welsh cultural history through records of bardic traditions, allowing users to search, browse, and download data related to historical Welsh bards.

## Features

*   **Multilingual Support**: Available in both Welsh (Cymraeg) and English.
*   **Search Functionality**: Client-side search powered by Lunr.js for quick lookup of bardic records.
*   **Bard Details Pages**: Dedicated pages for each bard, displaying comprehensive information.
*   **Data Download**: Option to download the complete dataset in JSON format.
*   **Responsive Design**: Built with Tailwind CSS for a seamless experience across devices.

## Technologies Used

*   **Astro**: The web framework for building the static site.
*   **Tailwind CSS**: A utility-first CSS framework for styling.
*   **Lunr.js**: A lightweight client-side search library.
*   **Node.js**: Used for data processing and search index generation scripts.
*   **CSV-Parse**: For parsing CSV data.
*   **UUID**: For generating unique IDs for records.

## Setup and Installation

To get this project up and running on your local machine, follow these steps:

### Prerequisites

*   Node.js (version 18 or higher recommended)
*   npm or Yarn

### Clone the Repository

```bash
git clone <your-repository-url>
cd <your-project-directory>
```

### Install Dependencies

```bash
npm install
# or
yarn install
```

## Running the Project

### Development Server

To start the development server and view the project in your browser:

```bash
npm run dev
# or
yarn dev
```

The application will typically be available at `http://localhost:4321`.

### Building for Production

To build the project for production deployment:

```bash
npm run build
# or
yarn build
```

This will generate the static files in the `dist/` directory.

### Previewing the Production Build

To preview the production build locally:

```bash
npm run preview
# or
yarn preview
```

## Data Processing

This project relies on two Node.js scripts to prepare and index the bardic data.

### 1. Process CSV Data (`scripts/process-csv.js`)

This script reads the raw bardic data from a CSV file, cleans it, and converts it into a structured JSON format (`src/files/bardicNames.json`).

*   **Input**: `data/input/bardic-data.csv`
*   **Output**: `src/files/bardicNames.json`

To run the CSV processing script:

```bash
npm run process-csv
```

### 2. Generate Search Index (`scripts/generate-search-index.js`)

This script takes the processed JSON data, builds a Lunr.js search index, and creates a document store. Both the index and the document store are then serialized into a single JSON file (`src/data/search-index.json`) for efficient client-side searching.

*   **Input**: `src/files/bardicNames.json`
*   **Output**: `src/data/search-index.json`

To run the search index generation script:

```bash
npm run generate-index
```

**Note**: The `generate-index` script should be run whenever `bardic-data.csv` or `src/files/bardicNames.json` is updated to ensure the search index is current.

## Deployment

This project is configured for deployment to GitHub Pages using GitHub Actions. The `.github/workflows/deploy.yml` workflow handles building and deploying the site automatically on pushes to the `main` branch.

## Project Structure

```
.
├── public/                 # Static assets (favicon, etc.)
├── src/
│   ├── components/         # Reusable Astro components
│   ├── data/               # JSON data (search index, static page content)
│   ├── files/              # Processed bardicNames.json
│   ├── i18n/               # Internationalization (i18n) configurations
│   ├── layouts/            # Astro layout components
│   └── pages/              # Astro pages (routes)
├── scripts/                # Node.js scripts for data processing and indexing
├── astro.config.mjs        # Astro configuration
├── package.json            # Project dependencies and scripts
├── tailwind.config.mjs     # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## License

MIT Licence for code
Open Data licence for Data
