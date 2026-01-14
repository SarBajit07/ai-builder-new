import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AppDataSource } from "@/lib/db/data-source";
import { User } from "@/lib/db/entities/User";
import { Project } from "@/lib/db/entities/Project";
import { MoreThanOrEqual } from "typeorm";
import { subDays, format, startOfDay } from "date-fns";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if ((session?.user as any)?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const db = await AppDataSource();
        const userRepo = db.getRepository(User);
        const projectRepo = db.getRepository(Project);

        const totalUsers = await userRepo.count();
        const totalProjects = await projectRepo.count();

        // Fetch Recent Users
        const recentUsers = await userRepo.find({
            order: { createdAt: "DESC" },
            take: 5,
            select: ["id", "email", "createdAt", "role"],
        });

        // Calculate 30 days ago
        const thirtyDaysAgo = subDays(startOfDay(new Date()), 30);

        // Fetch raw data for last 30 days
        // We select only createdAt to minimize data transfer
        const last30DaysUsers = await userRepo.find({
            where: {
                createdAt: MoreThanOrEqual(thirtyDaysAgo)
            },
            select: ["createdAt"]
        });

        const last30DaysProjects = await projectRepo.find({
            where: {
                createdAt: MoreThanOrEqual(thirtyDaysAgo)
            },
            select: ["createdAt"]
        });

        // Aggregate data by day
        const dailyStatsMap = new Map<string, { date: string; users: number; projects: number }>();

        // Initialize map with all 30 days to ensure no gaps
        for (let i = 0; i <= 30; i++) {
            const date = subDays(startOfDay(new Date()), i);
            const dateStr = format(date, "yyyy-MM-dd");
            dailyStatsMap.set(dateStr, { date: dateStr, users: 0, projects: 0 });
        }

        // Fill in actual data
        last30DaysUsers.forEach(u => {
            const dateStr = format(new Date(u.createdAt), "yyyy-MM-dd");
            if (dailyStatsMap.has(dateStr)) {
                dailyStatsMap.get(dateStr)!.users++;
            }
        });

        last30DaysProjects.forEach(p => {
            const dateStr = format(new Date(p.createdAt), "yyyy-MM-dd");
            if (dailyStatsMap.has(dateStr)) {
                dailyStatsMap.get(dateStr)!.projects++;
            }
        });

        // Convert to array and sort by date ascending
        const chartData = Array.from(dailyStatsMap.values()).sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        return NextResponse.json({
            totalUsers,
            totalProjects,
            recentUsers,
            chartData
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch stats" },
            { status: 500 }
        );
    }
}
