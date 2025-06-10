import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/data-source';
import { Project } from '../entities/Project';
import { AppError } from '../middlewares/errorHandler';

export const getAllProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.user?.id;
    if (!companyId) {
      throw new AppError('Unauthorized', 401);
    }

    const projectRepository = AppDataSource.getRepository(Project);
    const projects = await projectRepository.find({
      where: [
        { customerCompany: { id: companyId } },
        { executorCompany: { id: companyId } },
      ],
      relations: ['customerCompany', 'executorCompany'],
    });

    res.status(200).json({
      status: 'success',
      results: projects.length,
      data: {
        projects,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const companyId = req.user?.id;
    if (!companyId) {
      throw new AppError('Unauthorized', 401);
    }

    const projectRepository = AppDataSource.getRepository(Project);
    const project = await projectRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['customerCompany', 'executorCompany'],
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Check if user has access to this project
    if (
      project.customerCompany.id !== companyId &&
      project.executorCompany.id !== companyId
    ) {
      throw new AppError('You do not have access to this project', 403);
    }

    res.status(200).json({
      status: 'success',
      data: {
        project,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      description,
      status,
      stage,
      executorCompanyId,
      functions,
      expectedResult,
    } = req.body;
    const customerCompanyId = req.user?.id;

    if (!customerCompanyId) {
      throw new AppError('Unauthorized', 401);
    }

    const projectRepository = AppDataSource.getRepository(Project);
    const newProject = projectRepository.create({
      name,
      description,
      status,
      stage,
      customerCompany: { id: customerCompanyId },
      executorCompany: { id: executorCompanyId },
      functions,
      expectedResult,
    });

    await projectRepository.save(newProject);

    // Fetch the complete project with company relations
    const savedProject = await projectRepository.findOne({
      where: { id: newProject.id },
      relations: ['customerCompany', 'executorCompany'],
    });

    res.status(201).json({
      status: 'success',
      data: {
        project: savedProject,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const companyId = req.user?.id;
    if (!companyId) {
      throw new AppError('Unauthorized', 401);
    }

    const projectRepository = AppDataSource.getRepository(Project);
    const project = await projectRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['customerCompany', 'executorCompany'],
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Check if user has access to update this project
    if (
      project.customerCompany.id !== companyId &&
      project.executorCompany.id !== companyId
    ) {
      throw new AppError(
        'You do not have permission to update this project',
        403
      );
    }

    // Update project
    Object.assign(project, req.body);
    await projectRepository.save(project);

    res.status(200).json({
      status: 'success',
      data: {
        project,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const companyId = req.user?.id;
    if (!companyId) {
      throw new AppError('Unauthorized', 401);
    }

    const projectRepository = AppDataSource.getRepository(Project);
    const project = await projectRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['customerCompany', 'executorCompany'],
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Only customer company can delete the project
    if (project.customerCompany.id !== companyId) {
      throw new AppError('Only customer company can delete the project', 403);
    }

    await projectRepository.remove(project);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
