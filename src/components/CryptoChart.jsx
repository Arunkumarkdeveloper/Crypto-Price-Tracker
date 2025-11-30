"use client";
import { useState } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
  linearGradient,
  defs,
  stop,
} from "recharts";
import axios from "axios";
import useSWR from "swr";

export default function Chart({ coinId = "bitcoin" }) {
  const [range, setRange] = useState("24h");

  const fetcher = async (url) => {
    const res = await axios.get(url, {
      headers: {
        accept: "application/json",
        "x-cg-pro-api-key": process.env.NEXT_COINSTATS_API_KEY,
      },
    });

    return res.data.data.map(([timestamp, price]) => {
      const date = new Date(timestamp * 1000);
      let xValue;

      if (range === "1h" || range === "24h") {
        xValue = date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      } else if (["1w", "1m", "3m", "6m", "1y"].includes(range)) {
        xValue = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      } else if (range === "all") {
        xValue = date.getFullYear().toString();
      }

      return {
        x: xValue,
        price: Number(price.toFixed(2)),
        rawTime: timestamp,
      };
    });
  };

  const url = `https://api.coin-stats.com/v2/coin_chart/${coinId}/?type=${range}`;
  const { data: chartData, isLoading } = useSWR(url, fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    keepPreviousData: true,
  });

  const ranges = ["1h", "24h", "1w", "1m", "3m", "6m", "1y", "all"];

  return (
    <div className="w-full bg-white rounded-xl box-shadow p-4">
      <div className="chart-duration-group mb-2 flex gap-2">
        {ranges.map((item) => (
          <span key={item} onClick={() => setRange(item)}>
            {item.toUpperCase()}
          </span>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 0, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.2} />
          <XAxis
            dataKey="x"
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "0.5rem",
              border: "none",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
            formatter={(value) => [`$${value}`, "Price"]}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#gradient)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
