"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { shortNumber } from "@/lib/utils/shortNumber";

export default function CoinDetail({ coinId }) {
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCoin = async () => {
    try {
      setLoading(true);
      const url = `https://openapiv1.coinstats.app/coins/${coinId}`;

      const res = await axios.get(url, {
        headers: {
          "X-API-KEY": "YcLyV4It7PlGVBQOzJzWoB0GaYh4BV4qpdqRVdNGgkI=",
        },
      });

      setCoin(res.data);
    } catch (err) {
      console.error("Error fetching coin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoin();
  }, [coinId]);

  return (
    <div className="bg-white box-shadow rounded-xl p-6">
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={coin?.icon}
          alt={coin?.name}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">
            {coin?.name} ({coin?.symbol})
          </h1>
          <p className="text-gray-500">Current Price: ${coin?.price}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
          <p className="text-gray-500 text-sm">Market Cap</p>
          <p className="font-semibold">${shortNumber(coin?.marketCap)}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
          <p className="text-gray-500 text-sm">Fully Diluted Valuation</p>
          <p className="font-semibold">
            ${shortNumber(coin?.fullyDilutedValuation)}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
          <p className="text-gray-500 text-sm">Volume 24h</p>
          <p className="font-semibold">${shortNumber(coin?.volume)}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
          <p className="text-gray-500 text-sm">Mkt Cap 24h</p>
          <p className="font-semibold">${coin?.priceChange1w}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
          <p className="text-gray-500 text-sm">Total Supply</p>
          <p className="font-semibold">
            {coin?.totalSupply?.toLocaleString("en-US")}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
          <p className="text-gray-500 text-sm">Circulating Supply</p>
          <p className="font-semibold">
            {coin?.availableSupply?.toLocaleString("en-US")}
          </p>
        </div>
      </div>
    </div>
  );
}
