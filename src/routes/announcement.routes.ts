import { Router } from 'express';
import { body } from 'express-validator';
import { protect } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validateRequest';
import {
  getAllAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcement.controller';

const router = Router();

router.get('/', protect, getAllAnnouncements);
router.get('/:id', getAnnouncement);

router.post(
  '/',
  protect,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('type')
      .isIn(['search', 'offer'])
      .withMessage('Type must be either search or offer'),
    body('listOfRequirementsOrServices')
      .isArray()
      .withMessage('Requirements/Services must be an array'),
  ],
  validateRequest,
  createAnnouncement
);

router.put(
  '/:id',
  protect,
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description')
      .optional()
      .notEmpty()
      .withMessage('Description cannot be empty'),
    body('type')
      .optional()
      .isIn(['search', 'offer'])
      .withMessage('Type must be either search or offer'),
    body('listOfRequirementsOrServices')
      .optional()
      .isArray()
      .withMessage('Requirements/Services must be an array'),
  ],
  validateRequest,
  updateAnnouncement
);

router.delete('/:id', protect, deleteAnnouncement);

export const announcementRoutes = router;
