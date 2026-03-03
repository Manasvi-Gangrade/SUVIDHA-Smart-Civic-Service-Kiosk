import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useEffect, useState } from "react";
import { db } from "@/lib/database";

const pieData = [
    { name: "Resolved", value: 85, color: "#22c55e" },
    { name: "Pending", value: 30, color: "#f97316" },
    { name: "Critical", value: 5, color: "#ef4444" },
];

const Analytics = () => {
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        const stats = db.getStats();
        // Format for Recharts 
        const formatted = stats.byCategory.map(c => ({
            name: c.name,
            complaints: c.value,
            resolved: Math.floor(c.value * 0.4) // mock resolution rate
        }));
        setChartData(formatted);
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
                <p className="text-muted-foreground">Detailed insights into system performance and citizen satisfaction.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-6">Complaints by Department</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="name" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                />
                                <Legend />
                                <Bar dataKey="complaints" fill="#3b82f6" name="Total Complaints" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="resolved" fill="#22c55e" name="Resolved" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-6">Overall Status Distribution</h3>
                    <div className="h-[300px] w-full flex justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
