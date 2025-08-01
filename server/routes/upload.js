import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import DistributedItem from '../models/DistributedItem.js';
import distribute from '../utils/distribute.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

function validateRow(row) {
  const errors = {};

  if (!row.FirstName || typeof row.FirstName !== 'string') {
    errors.FirstName = 'FirstName is required and must be a string';
  }

  if (!row.Phone || isNaN(row.Phone)) {
    errors.Phone = 'Phone is required and must be a number';
  }

  if (!row.Notes || typeof row.Notes !== 'string') {
    errors.Notes = 'Notes is required and must be a string';
  }

  return errors;
}

function getFileExtension(filename) {
  return path.extname(filename).toLowerCase();
}

router.post('/', auth, upload.single('file'), async (req, res) => {
  const filePath = req.file.path;
  const fileExt = getFileExtension(req.file.originalname);
  let rawData = [];

  try {
    // Read file
    if (fileExt === '.csv') {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      rawData = xlsx.read(fileContent, { type: 'string' })
        .Sheets[Object.keys(xlsx.read(fileContent, { type: 'string' }).Sheets)[0]];
      rawData = xlsx.utils.sheet_to_json(rawData);
    } else if (['.xlsx', '.xls'].includes(fileExt)) {
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      rawData = xlsx.utils.sheet_to_json(sheet);
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Only CSV, XLSX, XLS allowed.' });
    }

    // Validate rows
    const validationErrors = [];
    rawData.forEach((row, index) => {
      const errors = validateRow(row);
      if (Object.keys(errors).length > 0) {
        validationErrors.push({ Row: index + 2, ...errors }); // +2 for header and base index
      }
    });

    if (validationErrors.length > 0) {
      fs.unlinkSync(filePath); // Cleanup
      return res.status(422).json({ error: 'Validation failed', details: validationErrors });
    }

    // Distribute items
    const agents = await User.find({ role: 'agent' });
    const distributed = distribute(rawData, agents);

    // Save to DB
    await DistributedItem.insertMany(distributed);

    fs.unlinkSync(filePath); // Cleanup
    res.json({ success: true, message: 'File uploaded and distributed successfully.' });

  } catch (error) {
    console.error(error);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // Cleanup on error
    res.status(500).json({ error: 'Failed to upload and distribute list.' });
  }
});

export default router;
