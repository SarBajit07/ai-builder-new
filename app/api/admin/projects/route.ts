import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AppDataSource } from "@/lib/db/data-source";
import { Project } from "@/lib/db/entities/Project";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if ((session?.user as any)?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const db = await AppDataSource();
        const projectRepo = db.getRepository(Project);

        const projects = await projectRepo.find({
            relations: ["user"],
            select: {
                id: true,
                name: true,
                framework: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    id: true,
                    email: true,
                }
            },
            order: { createdAt: "DESC" }
        });

        return NextResponse.json(projects);
    } catch (error) {
        console.error("GET /api/admin/projects error:", error);
        return NextResponse.json(
            { error: "Failed to fetch projects" },
            { status: 500 }
        );
    }
}
