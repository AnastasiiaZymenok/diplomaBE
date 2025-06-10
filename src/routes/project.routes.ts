import { Router } from 'express';
import { body } from 'express-validator';
import { protect, restrictTo } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validateRequest';
import {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/project.controller';

const router = Router();

router.get('/', getAllProjects);
router.get('/:id', getProject);

router.post(
  '/',
  protect,
  restrictTo('admin'),
  [
    body('name').notEmpty().withMessage('Project name is required'),
    body('status').notEmpty().withMessage('Status is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('stage')
      .isIn(['PLANNING', 'DEVELOPMENT', 'TESTING', 'DEPLOYMENT', 'COMPLETED'])
      .withMessage('Invalid project stage'),
    body('customerCompany').notEmpty().withMessage('Customer company is required'),
    body('executorCompany').notEmpty().withMessage('Executor company is required'),
    body('functions').isArray().withMessage('Functions must be an array'),
    body('expectedResult').notEmpty().withMessage('Expected result is required'),
  ],
  validateRequest,
  createProject
);

router.put(
  '/:id',
  protect,
  [
    body('name').optional().notEmpty().withMessage('Project name cannot be empty'),
    body('status').optional().notEmpty().withMessage('Status cannot be empty'),
    body('description')
      .optional()
      .notEmpty()
      .withMessage('Description cannot be empty'),
    body('stage')
      .optional()
      .isIn(['PLANNING', 'DEVELOPMENT', 'TESTING', 'DEPLOYMENT', 'COMPLETED'])
      .withMessage('Invalid project stage'),
    body('customerCompany')
      .optional()
      .notEmpty()
      .withMessage('Customer company cannot be empty'),
    body('executorCompany')
      .optional()
      .notEmpty()
      .withMessage('Executor company cannot be empty'),
    body('functions')
      .optional()
      .isArray()
      .withMessage('Functions must be an array'),
    body('expectedResult')
      .optional()
      .notEmpty()
      .withMessage('Expected result cannot be empty'),
  ],
  validateRequest,
  updateProject
);

router.delete('/:id', protect, restrictTo('admin'), deleteProject);

export const projectRoutes = router; 