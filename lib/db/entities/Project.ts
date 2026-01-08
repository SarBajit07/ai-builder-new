import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import { User } from "./User";

@Entity()
@Index(["user", "name"], { unique: true }) // Prevent duplicate project names per user
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ default: "nextjs", length: 50 })
  framework!: string;

  // Use jsonb instead of simple-json for PostgreSQL (better performance + querying)
  // If you're using SQLite/MySQL, keep simple-json
  @Column({ type: "jsonb", nullable: false, default: "{}" })
  frontendFiles!: Record<string, string>;

  @Column({ type: "jsonb", nullable: false, default: "{}" })
  backendFiles!: Record<string, string>;

  // Optional: store the last active file/path for UX persistence
  @Column({ nullable: true })
  lastActiveFile?: string;

  // Optional: project description or notes
  @Column({ type: "text", nullable: true })
  description?: string;

  // Relation to owner
  @ManyToOne(() => User, (user) => user.projects, {
    onDelete: "CASCADE", // Delete projects when user is deleted
    nullable: false,
  })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}