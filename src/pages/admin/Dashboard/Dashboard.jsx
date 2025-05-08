//src/pages/admin/Dashboard/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
    });

    const [salesData, setSalesData] = useState([]);

    useEffect(() => {
        // 模拟拉取数据
        setStats({
            totalOrders: 120,
            pendingOrders: 8,
            totalRevenue: 3450,
        });

        setSalesData([
            { day: 'Mon', revenue: 500 },
            { day: 'Tue', revenue: 700 },
            { day: 'Wed', revenue: 600 },
            { day: 'Thu', revenue: 800 },
            { day: 'Fri', revenue: 1200 },
            { day: 'Sat', revenue: 400 },
            { day: 'Sun', revenue: 750 },
        ]);
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">商家后台 · 数据总览</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardContent className="p-4">
                        <p className="text-gray-500">总订单数</p>
                        <h2 className="text-xl font-bold">{stats.totalOrders}</h2>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-gray-500">待处理订单</p>
                        <h2 className="text-xl font-bold">{stats.pendingOrders}</h2>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-gray-500">总营收（元）</p>
                        <h2 className="text-xl font-bold">{stats.totalRevenue}</h2>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-4">最近 7 天销售额</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
