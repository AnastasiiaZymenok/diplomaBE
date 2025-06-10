import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/data-source';
import { Company } from '../entities/Company';
import { AppError } from '../middlewares/errorHandler';
import fs from 'fs/promises';
import path from 'path';

export const getAllCompanies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyRepository = AppDataSource.getRepository(Company);
    const companies = await companyRepository.find({
      select: [
        'id',
        'name',
        'email',
        'industry',
        'description',
        'services',
        'foundedYear',
        'profilePhoto',
        'role',
        'createdAt',
        'updatedAt',
      ],
    });

    res.status(200).json({
      status: 'success',
      results: companies.length,
      data: {
        companies,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const companyRepository = AppDataSource.getRepository(Company);
    const company = await companyRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['users'],
    });

    if (!company) {
      throw new AppError('Company not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        company,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const companyRepository = AppDataSource.getRepository(Company);
    const company = await companyRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!company) {
      throw new AppError('Company not found', 404);
    }

    // Check if user has permission to update
    if (req.user?.company.id !== company.id) {
      throw new AppError(
        'You do not have permission to update this company',
        403
      );
    }

    // Update company
    Object.assign(company, updateData);
    await companyRepository.save(company);

    res.status(200).json({
      status: 'success',
      data: {
        company,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const uploadCompanyPhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      throw new AppError('Please upload a photo', 400);
    }

    const companyRepository = AppDataSource.getRepository(Company);
    const company = await companyRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!company) {
      // Delete uploaded file if company not found
      await fs.unlink(req.file.path);
      throw new AppError('Company not found', 404);
    }

    // Check if user has permission to update
    if (req.user?.company.id !== company.id) {
      // Delete uploaded file if unauthorized
      await fs.unlink(req.file.path);
      throw new AppError(
        'You do not have permission to update this company',
        403
      );
    }

    // Delete old photo if exists
    if (company.profilePhoto) {
      const oldPhotoPath = path.join(
        process.env.UPLOAD_DIR || 'uploads',
        company.profilePhoto
      );
      try {
        await fs.unlink(oldPhotoPath);
      } catch (error) {
        console.error('Error deleting old photo:', error);
      }
    }

    // Update company with new photo
    company.profilePhoto = req.file.filename;
    await companyRepository.save(company);

    res.status(200).json({
      status: 'success',
      data: {
        company,
      },
    });
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (error) {
        console.error('Error deleting uploaded file:', error);
      }
    }
    next(error);
  }
};

export const getMyCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.user?.id;
    if (!companyId) {
      throw new AppError('Unauthorized', 401);
    }

    const companyRepository = AppDataSource.getRepository(Company);
    const company = await companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new AppError('Company not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        company,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.user?.id;
    if (!companyId) {
      throw new AppError('Unauthorized', 401);
    }

    const companyRepository = AppDataSource.getRepository(Company);
    const company = await companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new AppError('Company not found', 404);
    }

    // Update company
    Object.assign(company, req.body);
    await companyRepository.save(company);

    res.status(200).json({
      status: 'success',
      data: {
        company,
      },
    });
  } catch (error) {
    next(error);
  }
};
