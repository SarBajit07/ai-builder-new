// import { NextResponse } from "next/server";
// import { AppDataSource } from "@/lib/db/data-source";
// import { User } from "@/lib/db/entities/User";
// import bcrypt from "bcryptjs";

// /** 
//  * GET /api/users
//  * Returns all users (without sensitive data)
//  */
// export async function GET() {
//   try {
//     const db = await AppDataSource();
//     const userRepo = db.getRepository(User);

//     const users = await userRepo.find({
//       select: ["id", "email", "role", "name", "createdAt", "updatedAt"],
//     });

//     return NextResponse.json(users, { status: 200 });
//   } catch (error: any) {
//     console.error("GET /api/users failed:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch users", details: error.message },
//       { status: 500 }
//     );
//   }
// }

// /**
//  * POST /api/users
//  * Creates a new user (Signup)
//  */
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     console.log("Signup request body:", body); // ← Debug: see what the client sends

//     if (!body.email || !body.password) {
//       return NextResponse.json(
//         { error: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     const db = await AppDataSource();
//     console.log("Database connected:", db.isInitialized); // ← Important debug

//     const userRepo = db.getRepository(User);

//     // Check for existing user
//     const existing = await userRepo.findOne({ where: { email: body.email } });
//     if (existing) {
//       return NextResponse.json({ error: "User already exists" }, { status: 409 });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(body.password, 12);
//     console.log("Password hashed successfully");

//     // Create user with correct field name: passwordHash (matches your entity)
//     const user = userRepo.create({
//       email: body.email,
//       passwordHash: hashedPassword,      // ← This was the main bug: password → passwordHash
//       role: body.role ?? "user",
//       name: body.name || null,           // optional
//     });

//     console.log("User object ready to save:", {
//       email: user.email,
//       role: user.role,
//       hasPasswordHash: !!user.passwordHash,
//     });

//     // Save to database
//     await userRepo.save(user);
//     console.log("User created successfully! ID:", user.id);

//     // Remove sensitive data before response
//     const { passwordHash, ...safeUser } = user;

//     return NextResponse.json(safeUser, { status: 201 });
//   } catch (error: any) {
//     console.error("=== SIGNUP CRASHED ===");
//     console.error("Error message:", error.message);
//     console.error("Full error:", error);
//     console.error("Stack trace:", error.stack);
//     return NextResponse.json(
//       {
//         error: "Failed to create user",
//         details: error.message || "Unknown error - check server logs",
//       },
//       { status: 500 }
//     );
//   }
// }

// sarbajit's code

import { NextResponse } from "next/server";
import { AppDataSource } from "@/lib/db/data-source";
import { User } from "@/lib/db/entities/User";
import bcrypt from "bcryptjs";

/** 
 * GET /api/users
 * Returns all users
 */
export async function GET() {
  try {
    const db = await AppDataSource();
    const userRepo = db.getRepository(User);

    // Security Check: Ensure user is admin
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/app/api/auth/[...nextauth]/route");
    const session = await getServerSession(authOptions);

    if ((session?.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await userRepo.find({
      select: ["id", "email", "role", "createdAt", "updatedAt"], // no password
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users
 * Creates a new user (Signup)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const db = await AppDataSource();
    const userRepo = db.getRepository(User);

    const existing = await userRepo.findOne({
      where: { email: body.email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = userRepo.create({
      email: body.email,
      password: hashedPassword,
      role: body.role ?? "user",
    });

    await userRepo.save(user);

    // Strip password before returning
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
