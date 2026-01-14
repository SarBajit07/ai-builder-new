"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, FolderGit2, ArrowUpRight, Loader2, Activity, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

interface DashboardStats {
  totalUsers: number;
  totalProjects: number;
  recentUsers: {
    id: string;
    email: string;
    createdAt: string;
    role: string;
  }[];
  chartData: {
    date: string;
    users: number;
    projects: number;
  }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError("Could not load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-zinc-400">Welcome back, Administrator</p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={item}>
          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm hover:border-red-500/30 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats?.totalUsers}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm hover:border-orange-500/30 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Total Projects
              </CardTitle>
              <FolderGit2 className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats?.totalProjects}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Placeholder functionality for now */}
        <motion.div variants={item}>
          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm hover:border-blue-500/30 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Active Sessions
              </CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                --
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm hover:border-emerald-500/30 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Growth Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">

              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm"
        >
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-red-500" /> User Signups (30 Days)
          </h3>
          <div className="h-[250px] lg:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.chartData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#71717a"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).getDate().toString()}
                />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                  itemStyle={{ color: '#ef4444' }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm"
        >
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-orange-500" /> Project Creation (30 Days)
          </h3>
          <div className="h-[250px] lg:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#71717a"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).getDate().toString()}
                />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                />
                <Bar dataKey="projects" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm overflow-hidden"
      >
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="font-semibold text-white">Recent Users</h3>
          <button className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">
            View All <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {stats?.recentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="bg-transparent hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-800 flex items-center justify-center text-xs font-bold">
                        {user.email[0].toUpperCase()}
                      </div>
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === "admin"
                        ? "bg-red-500/10 text-red-500 border border-red-500/20"
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
