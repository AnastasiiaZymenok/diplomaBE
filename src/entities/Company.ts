import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Announcement } from './Announcement';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  industry: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'founded_year' })
  foundedYear: number;

  @Column('text', { array: true })
  services: string[];

  @Column('text')
  description: string;

  @Column({ name: 'profile_photo', nullable: true })
  profilePhoto?: string;

  @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
  role: 'admin' | 'user';

  @OneToMany(() => Announcement, (announcement) => announcement.company)
  announcements: Announcement[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
