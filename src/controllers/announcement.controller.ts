import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/data-source';
import { Announcement } from '../entities/Announcement';
import { AppError } from '../middlewares/errorHandler';

export const getAllAnnouncements = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, companyId } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const announcementRepository = AppDataSource.getRepository(Announcement);
    const queryBuilder = announcementRepository
      .createQueryBuilder('announcement')
      .leftJoinAndSelect('announcement.company', 'company');

    if (type) {
      queryBuilder.andWhere('announcement.type = :type', { type });
    }

    if (companyId) {
      queryBuilder.andWhere('announcement.company_id = :companyId', {
        companyId,
      });
    }

    const [announcements, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    if (announcements.length === 0) {
      return res.status(200).json({
        status: 'success',
        data: {
          announcements: [],
          pagination: {
            total: 0,
            page,
            limit,
            pages: 0,
          },
        },
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        announcements,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAnnouncement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const announcementRepository = AppDataSource.getRepository(Announcement);
    const announcement = await announcementRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['company'],
    });

    if (!announcement) {
      throw new AppError('Announcement not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        announcement,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createAnnouncement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, type, listOfRequirementsOrServices } = req.body;

    const announcementRepository = AppDataSource.getRepository(Announcement);
    const newAnnouncement = announcementRepository.create({
      title,
      description,
      type,
      listOfRequirementsOrServices,
      company: req.user?.company,
    });

    await announcementRepository.save(newAnnouncement);

    res.status(201).json({
      status: 'success',
      data: {
        announcement: newAnnouncement,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateAnnouncement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const announcementRepository = AppDataSource.getRepository(Announcement);
    const announcement = await announcementRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['company'],
    });

    if (!announcement) {
      throw new AppError('Announcement not found', 404);
    }

    // Check if user has permission to update
    if (req.user?.company.id !== announcement.company.id) {
      throw new AppError(
        'You do not have permission to update this announcement',
        403
      );
    }

    // Update announcement
    Object.assign(announcement, updateData);
    await announcementRepository.save(announcement);

    res.status(200).json({
      status: 'success',
      data: {
        announcement,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAnnouncement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const announcementRepository = AppDataSource.getRepository(Announcement);
    const announcement = await announcementRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['company'],
    });

    if (!announcement) {
      throw new AppError('Announcement not found', 404);
    }

    // Check if user has permission to delete
    if (req.user?.company.id !== announcement.company.id) {
      throw new AppError(
        'You do not have permission to delete this announcement',
        403
      );
    }

    await announcementRepository.remove(announcement);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
