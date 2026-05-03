import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const OrdersChart = () => {
  const [data, setData] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/orders`);
        const orders = res.data;

        // Aggregate orders by date
        const grouped = {};
        orders.forEach((o) => {
          const date = new Date(o.createdAt).toLocaleDateString();
          grouped[date] = (grouped[date] || 0) + o.total || 0;
        });

        const chartData = Object.keys(grouped).map((date) => ({
          date,
          total: grouped[date],
        }));

        setData(chartData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default OrdersChart;
