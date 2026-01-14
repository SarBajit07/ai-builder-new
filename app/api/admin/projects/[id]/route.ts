import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AppDataSource } from "@/lib/db/data-source";
import { Project } from "@/lib/db/entities/Project";

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
        const projectRepo = db.getRepository(Project);

        await projectRepo.delete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/admin/projects/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to delete project" },
            { status: 500 }
        );
    }
}
