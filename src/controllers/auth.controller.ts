import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source';
import { Company } from '../entities/Company';
import { AppError } from '../middlewares/errorHandler';

const generateToken = (id: number): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name, industry, foundedYear, services, description } = req.body;

    // Check if company already exists
    const companyRepository = AppDataSource.getRepository(Company);
    const existingCompany = await companyRepository.findOne({
      where: { email },
    });

    if (existingCompany) {
      throw new AppError('Company with this email already exists', 400);
    }

    // Create company
    const hashedPassword = await bcrypt.hash(password, 12);
    const newCompany = companyRepository.create({
      email,
      password: hashedPassword,
      name,
      industry,
      foundedYear,
      services,
      description,
      role: 'user',
    });
    await companyRepository.save(newCompany);

    // Generate token
    const token = generateToken(newCompany.id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        company: {
          id: newCompany.id,
          email: newCompany.email,
          name: newCompany.name,
          industry: newCompany.industry,
          role: newCompany.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Check if company exists
    const companyRepository = AppDataSource.getRepository(Company);
    const company = await companyRepository.findOne({
      where: { email },
    });

    if (!company) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, company.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate token
    const token = generateToken(company.id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        company: {
          id: company.id,
          email: company.email,
          name: company.name,
          industry: company.industry,
          role: company.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const company = req.user;
    if (!company) {
      throw new AppError('Company not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        company: {
          id: company.id,
          email: company.email,
          name: company.name,
          industry: company.industry,
          role: company.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}; 