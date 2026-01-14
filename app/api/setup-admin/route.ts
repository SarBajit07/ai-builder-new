import { NextResponse } from "next/server";
import { AppDataSource } from "@/lib/db/data-source";
import { User } from "@/lib/db/entities/User";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        const db = await AppDataSource();
        const userRepo = db.getRepository(User);

        const email = "admin@gmail.com";
        const password = "adminpassword123";

        console.log("Setup-admin: Starting reset for", email);

        // Check if admin already exists
        const existingAdmin = await userRepo.findOne({
            where: { email },
        });

        if (existingAdmin) {
            console.log("Setup-admin: Found existing admin, deleting for clean state");
            await userRepo.remove(existingAdmin);
            console.log("Setup-admin: Existing admin removed");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Setup-admin: Generated hash length:", hashedPassword.length);
        console.log("Setup-admin: Generated hash start:", hashedPassword.substring(0, 15));

        const admin = userRepo.create({
            email,
            password: hashedPassword,
            role: "admin",
        });

        await userRepo.save(admin);
        console.log("Setup-admin: Admin user saved successfully");

        return NextResponse.json({
            status: "success",
            message: "Admin user reset successfully with 16-character password",
            credentials: { email, password },
            debug: {
                hashLength: hashedPassword.length,
                emailMatched: admin.email === email
            }
        });
    } catch (error) {
        console.error("Error creating admin:", error);
        return NextResponse.json(
            { error: "Failed to create admin user" },
            { status: 500 }
        );
    }
}
