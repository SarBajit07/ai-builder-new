// lib/db/entities/Project.ts
import "reflect-metadata";

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ type: "varchar", length: 255 })
  name?: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "varchar", length: 50, default: "draft" })
  status?: string; // e.g. "draft", "active", "archived"

  // Use "json" instead of "jsonb" for SQLite compatibility
  @Column({ type: "json", nullable: true })
  frontendFiles?: Record<string, string>;

  @Column({ type: "json", nullable: true })
  backendFiles?: Record<string, string>;

  // Alternative: single data field if you prefer (e.g. full ProjectState)
  @Column({ type: "json", nullable: true })
  data?: any; // or Record<string, any> if you want stricter typing

  // Use string reference to avoid circular import
  @ManyToOne("User", (user) => user.projects, {
    onDelete: "CASCADE",
    nullable: false,
  })
  user?: User;

  @CreateDateColumn({ type: "datetime" })
  createdAt?: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt?: Date;
}