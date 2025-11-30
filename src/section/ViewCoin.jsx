"use client";
import React from 'react'
import CryptoChart from "@/components/CryptoChart";
import CoinDetail from '@/components/CoinDetail';
import PriceStatsCard from '@/components/PriceStatsCard';

export default function ViewCoin({coinId}) {
  return (
    <div className="flex justify-center">
      <div className="view-coin-container">
        <CoinDetail coinId={coinId} />
        <CryptoChart coinId={coinId} />
        <PriceStatsCard coinId={coinId} />
      </div>
    </div>
  );
}
