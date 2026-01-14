import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AppDataSource } from "@/lib/db/data-source";
import { User } from "@/lib/db/entities/User";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if ((session?.user as any)?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const db = await AppDataSource();
        const userRepo = db.getRepository(User);

        await userRepo.delete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE user error:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if ((session?.user as any)?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { role } = body;

        const db = await AppDataSource();
        const userRepo = db.getRepository(User);

        await userRepo.update(id, { role });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("UPDATE user error:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}
