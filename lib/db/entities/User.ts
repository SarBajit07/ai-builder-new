// lib/db/entities/User.ts
// import "reflect-metadata";

// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   OneToMany,
//   CreateDateColumn,
//   UpdateDateColumn,
//   Index,
//   BeforeInsert,
//   BeforeUpdate,
// } from "typeorm";
// import bcrypt from "bcryptjs";

// @Entity()
// export class User {
//   @PrimaryGeneratedColumn("uuid")
//   id?: string;

//   @Column({ type: "varchar", length: 255, unique: true })
//   @Index()
//   email?: string;

//   @Column({ type: "varchar", length: 100, nullable: true })
//   name?: string;

//   @Column({ type: "varchar", length: 50, default: "user" })
//   role?: string;

//   @Column({ type: "varchar", length: 255, nullable: true, select: false })
//   passwordHash?: string;

//   @Column({ type: "datetime", nullable: true })
//   lastLogin?: Date;

//   // Use string reference to avoid circular import
//   @OneToMany("Project", (project) => project.user, {
//     cascade: ["insert", "update"],
//     onDelete: "CASCADE",
//   })
//   projects?: Project[];

//   @CreateDateColumn({ type: "datetime" })
//   createdAt?: Date;

//   @UpdateDateColumn({ type: "datetime" })
//   updatedAt?: Date;

//   @BeforeInsert()
//   @BeforeUpdate()
//   async hashPassword() {
//     if (this.passwordHash && !this.passwordHash.startsWith("$2")) {
//       this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
//     }
//   }

//   async comparePassword(candidate: string): Promise<boolean> {
//     if (!this.passwordHash) return false;
//     return bcrypt.compare(candidate, this.passwordHash);
//   }

//   isAdmin(): boolean {
//     return this.role === "admin";
//   }
// }


// Sarbajit's code 

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Project } from "./Project";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ default: "user" })
  role!: string;

  @Column({ nullable: true })
  password?: string;

  @OneToMany("Project", (project: Project) => project.user)
  projects!: Project[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
