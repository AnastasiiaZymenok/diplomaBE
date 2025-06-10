import { Router } from 'express';
import { body } from 'express-validator';
import { protect } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validateRequest';
import {
  getCompany,
  updateCompany,
  uploadCompanyPhoto,
  getAllCompanies,
  getMyCompany,
  updateMyCompany,
} from '../controllers/company.controller';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// Current company routes
router.get('/me', protect, getMyCompany);

router.put(
  '/me',
  protect,
  [
    body('name')
      .optional()
      .notEmpty()
      .withMessage('Company name cannot be empty'),
    body('industry')
      .optional()
      .notEmpty()
      .withMessage('Industry cannot be empty'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('foundedYear')
      .optional()
      .isInt()
      .withMessage('Founded year must be a number'),
    body('services')
      .optional()
      .isArray()
      .withMessage('Services must be an array'),
    body('description')
      .optional()
      .notEmpty()
      .withMessage('Description cannot be empty'),
  ],
  validateRequest,
  updateMyCompany
);

// Other company routes
router.get('/', protect, getAllCompanies);

router.get('/:id', getCompany);

router.put(
  '/:id',
  protect,
  [
    body('name')
      .optional()
      .notEmpty()
      .withMessage('Company name cannot be empty'),
    body('industry')
      .optional()
      .notEmpty()
      .withMessage('Industry cannot be empty'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('foundedYear')
      .optional()
      .isInt()
      .withMessage('Founded year must be a number'),
    body('services')
      .optional()
      .isArray()
      .withMessage('Services must be an array'),
    body('description')
      .optional()
      .notEmpty()
      .withMessage('Description cannot be empty'),
  ],
  validateRequest,
  updateCompany
);

router.post('/:id/photo', protect, upload.single('photo'), uploadCompanyPhoto);

export const companyRoutes = router;
