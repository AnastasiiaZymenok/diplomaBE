import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Company } from './Company';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  status: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: ['PLANNING', 'DEVELOPMENT', 'TESTING', 'DEPLOYMENT', 'COMPLETED'],
  })
  stage: 'PLANNING' | 'DEVELOPMENT' | 'TESTING' | 'DEPLOYMENT' | 'COMPLETED';

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'customer_company_id' })
  customerCompany: Company;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'executor_company_id' })
  executorCompany: Company;

  @Column('text', { array: true })
  functions: string[];

  @Column('text', { name: 'expected_result' })
  expectedResult: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
