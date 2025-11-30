"use client";
import axios from "axios";
import useSWR from "swr";

export default function PriceStatsCard({ coinId }) {
  const fetcher = async (url) => {
    const res = await axios.get(url, {
      headers: {
        accept: "application/json",
        "x-cg-pro-api-key": "YcLyV4It7PlGVBQOzJzWoB0GaYh4BV4qpdqRVdNGgkI=",
      },
    });

    const arr = res.data.data;
    return arr;
  };

  const url = `https://api.coin-stats.com/v2/coin_chart/${coinId}/?type=24h`;

  const { data, error, isLoading } = useSWR(url, fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    keepPreviousData: true,
  });
    const maxObject = data?.reduce((max, item) =>
      item.price > max.price ? item : max
    );
      const minObject = data?.reduce((min, item) =>
        item.price < min.price ? item : min
      );
    console.log(maxObject, minObject);

  return (
    <div className="bg-white box-shadow rounded-xl p-6">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-lg font-semibold">Price Change</h2>
        <span className="text-gray-500 text-sm">24h</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm font-bold">Low</span>
          <span className="text-gray-900 font-medium">{minObject?.price?.toLocaleString("en-US")}</span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-gray-500 text-sm font-bold">High</span>
          <span className="text-gray-900 font-medium">{maxObject?.price?.toLocaleString("en-US")}</span>
        </div>
      </div>
    </div>
  );
}
