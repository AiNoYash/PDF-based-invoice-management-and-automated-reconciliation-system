const natural = require('natural');
const path = require('path');
const fs = require('fs');

const MODEL_FILE = path.join(__dirname, 'invoice_classifier.json');

// Top-level singleton
let classifierInstance = null;

function getClassifier() {
    return new Promise((resolve, reject) => {
        if (classifierInstance) {
            return resolve(classifierInstance);
        }

        // 2. If it's not in memory, check if the file exists on disk
        if (fs.existsSync(MODEL_FILE)) {
            natural.BayesClassifier.load(MODEL_FILE, null, (err, loadedClassifier) => {
                if (err) return reject(err);
                
                classifierInstance = loadedClassifier;
                resolve(classifierInstance);
            });
        } else {
            // 3. If no file exists, create a fresh one
            classifierInstance = new natural.BayesClassifier();
            resolve(classifierInstance);
        }
    });
}

/**
 * Saves the current singleton instance to disk.
 */
function saveClassifier() {
    if (!classifierInstance) return;
    
    classifierInstance.save(MODEL_FILE, (err) => {
        if (err) console.error("Failed to save model:", err);
        else console.log("Model saved to disk.");
    });
}


function trainAndSave() {
        const classifier = new natural.BayesClassifier();
        
        // Add training examples
        classifier.addDocument('Invoice No:', 'invoice_id_anchor');
        classifier.addDocument('Invoice #', 'invoice_id_anchor');
        classifier.addDocument('Bill To:', 'invoice_id_anchor');
        classifier.addDocument('TAX INVOICE', 'invoice_id_anchor');
        
        // Train the classifier
        classifier.train();

        saveClassifier();
}


module.exports = {
    getClassifier,
    saveClassifier
};