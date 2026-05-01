/**
 * PDF Parser Module
 * 
 * This module is responsible for extracting text and spatial data (bounding boxes) 
 * from PDF documents using Mozilla's pdf.js. This spatial data is critical for our 
 * template-free parsing strategy, as it allows us to locate values based on their 
 * proximity to classified anchor nodes (e.g., finding the date next to "Date:").
 * 
 * Prerequisites:
 * Ensure you have installed pdfjs-dist. If not, run:
 * npm install pdfjs-dist
 */

const fs = require('fs');
let pdfjsLibPromise;

async function getPdfJsLib() {
    if (!pdfjsLibPromise) {
        pdfjsLibPromise = import('pdfjs-dist/legacy/build/pdf.mjs');
    }
    return pdfjsLibPromise;
}

/**
 * Parses a PDF document and extracts detailed text content, including spatial coordinates.
 * It opens the PDF, parses it page by page, and extracts the 'items' array which 
 * contains the text strings and their precise X, Y coordinates on the page.
 * 
 * @param {string} pdfPath - The absolute or relative path to the PDF file you want to parse.
 * @returns {Promise<Array>} A promise that resolves to an array containing the parsed text nodes for each page.
 */
async function parsePdf(pdfPath) {
    try {
        console.log(`[Parser] Starting extraction for file: ${pdfPath}`);
        const pdfjsLib = await getPdfJsLib();

        // 1. Read the PDF file into a standard Node.js Buffer.
        // We use fs.promises.readFile to read the file asynchronously without blocking the event loop.
        const dataBuffer = await fs.promises.readFile(pdfPath);

        // Convert the Node.js Buffer into a Uint8Array. 
        // pdf.js's getDocument function expects binary data in this specific format.
        const dataUint8Array = new Uint8Array(dataBuffer);

        // 2. Load the document into pdf.js
        // getDocument initializes the parsing process. It returns a "loading task".
        // The promise inside this task resolves to the actual PDF document object.
        const loadingTask = pdfjsLib.getDocument({
            data: dataUint8Array,
            disableWorker: true
        });
        const pdfDocument = await loadingTask.promise;

        console.log(`[Parser] Successfully loaded PDF. Total pages: ${pdfDocument.numPages}`);

        const allPagesContent = [];

        // 3. Iterate through each page of the PDF
        // Note: pdf.js pages are 1-indexed (starting at page 1, not 0)
        for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
            console.log(`\n--- Processing Page ${pageNum} ---`);

            // Fetch the specific page object from the loaded document
            const page = await pdfDocument.getPage(pageNum);

            // 4. Extract text content with spatial data
            // getTextContent() is the crucial function for our spatial analysis. 
            // It doesn't just return a single merged string of text.
            // Instead, it returns an object containing an 'items' array. Each item represents 
            // an individual text node (often a word, a line, or a phrase) and contains the string 
            // itself along with its 'transform' matrix which gives us X, Y coordinates.
            const textContent = await page.getTextContent();

            


            // Store the items for this page in our results array to be returned.
            // This structure will be useful later for Step B (Spatial Match).
            allPagesContent.push({
                page: pageNum,
                items: textContent.items
            });
        }

        console.log(`[Parser] Finished processing ${pdfPath}`);
        return allPagesContent;

    } catch (error) {
        console.error(`[Parser] Error occurred while parsing the PDF:`, error);
        throw error;
    }
}

// Export the function so it can be integrated with the classifier and API routes
module.exports = {
    parsePdf
};
