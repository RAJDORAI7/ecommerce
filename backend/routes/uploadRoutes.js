import express from 'express';
import multer from 'multer';
import asyncHandler from 'express-async-handler';
import cloudinary from '../config/cloudinary.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Use memory storage and pipe to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    if (allowedTypes.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, PNG, WEBP images are allowed'));
    }
  },
});

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
router.post(
  '/',
  protect,
  admin,
  upload.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded');
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'ecommerce',
      resource_type: 'auto',
    });

    res.json({
      success: true,
      data: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });
  })
);

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/:public_id
// @access  Private/Admin
router.delete(
  '/:public_id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    await cloudinary.uploader.destroy(req.params.public_id);
    res.json({ success: true, message: 'Image deleted' });
  })
);

export default router;
