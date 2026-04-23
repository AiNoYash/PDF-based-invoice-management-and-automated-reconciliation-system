const uploadInvoice = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        res.status(200).json({ 
            message: "PDF uploaded successfully! (Parsing logically pending)", 
            fileName: req.file.filename,
            originalName: req.file.originalname 
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Server upload error" });
    }
};

module.exports = {
    uploadInvoice
};
