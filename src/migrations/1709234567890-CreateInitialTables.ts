import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1709234567890 implements MigrationInterface {
  name = 'CreateInitialTables1709234567890';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create companies table
    await queryRunner.query(`
            CREATE TABLE "companies" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "industry" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "founded_year" integer NOT NULL,
                "services" text[] NOT NULL,
                "description" text NOT NULL,
                "profile_photo" character varying,
                "role" character varying NOT NULL DEFAULT 'user',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_companies_email" UNIQUE ("email"),
                CONSTRAINT "PK_companies" PRIMARY KEY ("id")
            )
        `);

    // Create announcements table
    await queryRunner.query(`
            CREATE TABLE "announcements" (
                "id" SERIAL NOT NULL,
                "title" character varying NOT NULL,
                "description" text NOT NULL,
                "type" character varying NOT NULL,
                "list_of_requirements_or_services" text[] NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "company_id" integer,
                CONSTRAINT "PK_announcements" PRIMARY KEY ("id"),
                CONSTRAINT "FK_announcements_company" FOREIGN KEY ("company_id") 
                    REFERENCES "companies"("id") ON DELETE CASCADE
            )
        `);

    // Create projects table
    await queryRunner.query(`
            CREATE TABLE "projects" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "status" character varying NOT NULL,
                "description" text NOT NULL,
                "stage" character varying NOT NULL,
                "customer_company" character varying NOT NULL,
                "executor_company" character varying NOT NULL,
                "functions" text[] NOT NULL,
                "expected_result" text NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_projects" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TABLE "announcements"`);
    await queryRunner.query(`DROP TABLE "companies"`);
  }
}
