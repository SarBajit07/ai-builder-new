import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import { Project } from "./Project";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true, length: 255 })
  @Index() // faster lookups
  email!: string;

  @Column({ length: 100, nullable: true })
  name?: string; // optional full name

  @Column({ default: "user", length: 50 })
  role!: string; // e.g. "user", "admin", "moderator"

  // Hashed password (never store plain text!)
  @Column({ nullable: true, select: false }) // exclude from default queries
  passwordHash?: string;

  // Optional: last login time (useful for security)
  @Column({ type: "timestamp", nullable: true })
  lastLogin?: Date;

  // Relation to owned projects
  @OneToMany(() => Project, (project) => project.user, {
    cascade: ["insert", "update"], // auto-save projects when saving user
    onDelete: "CASCADE", // delete projects when user is deleted
  })
  projects!: Project[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Optional helper method: check if user is admin
  isAdmin(): boolean {
    return this.role === "admin";
  }
}