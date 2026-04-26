const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("./cloudinary");

// Configuration du storage Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "kingfood-products",
        allowed_formats: ["jpg", "png", "jpeg"]
    }
});

// Export
const upload = multer({
    storage,
    limits: { fileSize: 10485760 } // 10 Mo maximum
});

module.exports = { upload };