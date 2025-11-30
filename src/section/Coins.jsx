"use client";
import PaginatedItems from "@/components/PaginatedItems";
import { sortData } from "@/lib/utils/sortData";
import { toastMessage } from "@/lib/utils/toastMessage";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useMemo, useRef } from "react";
import useSWR from "swr";
import { useDebounce } from "use-debounce";
import Search from "@/components/Search";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { shortNumber } from "@/lib/utils/shortNumber";

export default function Coins() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 100 });
  const skip = (pagination.page - 1) * pagination.limit;
  const [query, setQuery] = useState("");
  const [_query] = useDebounce(query, 500);
  const dropdownRef = useRef(null);

  const [currency, setCurrency] = useState("USD");

  const [sortKey, setSortKey] = useState("");
  const [direction, setDirection] = useState("desc");

  const fetcher = (url) => axios.get(url).then((res) => res.data.coins);

  const {
    data: coins,
    error,
    isLoading,
  } = useSWR(
    `https://api.coin-stats.com/v4/coins?skip=${skip}&limit=100`,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  );

  const sortedCoins = useMemo(
    () => sortData(coins, sortKey, direction),
    [coins, sortKey, direction]
  );

  const handleSort = (key) => {
    if (key === sortKey) {
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setDirection("asc");
    }
  };

  const getSearch = async () => {
    // if (query?.length === 0) return;
    // setIsOpen(true);
    // setIsLoading(true);
    // try {
    //   const response = await _get(`/api/search?query=${_query}`);
    //   setSearchList(response?.data);
    // } catch (error) {
    //   console.log("error", error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const SearchContainer = (
    <React.Fragment>
      <Search
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        handleSearch={getSearch}
      />
    </React.Fragment>
  );

  const _coins = sortedCoins?.filter((item) => {
    return item?.n?.toLowerCase()?.includes(_query?.toLowerCase())
  })

  console.log(_query, _coins);

  return (
    <>
      {sortedCoins?.length !== 0 && (
        <div className="layout-center pb-50">
          <div className="coins-table-width mb-20">
            <div className="flex justify-end  mb-20">
              <div className="input-container input-search" ref={dropdownRef}>
                {SearchContainer}
              </div>
            </div>
            <table id="coins">
              <tbody>
                <tr>
                  <th onClick={() => handleSort("r")}>
                    #{" "}
                    {sortKey === "r" ? (
                      direction === "asc" ? (
                        "▲"
                      ) : (
                        "▼"
                      )
                    ) : (
                      <span>↕</span>
                    )}
                  </th>
                  <th onClick={() => handleSort("n")}>
                    Name{" "}
                    {sortKey === "n" ? (
                      direction === "asc" ? (
                        "▲"
                      ) : (
                        "▼"
                      )
                    ) : (
                      <span>↕</span>
                    )}
                  </th>
                  <th onClick={() => handleSort("pu")}>
                    Current Price{" "}
                    {sortKey === "pu" ? (
                      direction === "asc" ? (
                        "▲"
                      ) : (
                        "▼"
                      )
                    ) : (
                      <span>↕</span>
                    )}
                  </th>
                  <th onClick={() => handleSort("p1h")}>
                    1h Change %{" "}
                    {sortKey === "p1h" ? (
                      direction === "asc" ? (
                        "▲"
                      ) : (
                        "▼"
                      )
                    ) : (
                      <span>↕</span>
                    )}
                  </th>
                  <th onClick={() => handleSort("p24")}>
                    24h Change %{" "}
                    {sortKey === "p24" ? (
                      direction === "asc" ? (
                        "▲"
                      ) : (
                        "▼"
                      )
                    ) : (
                      <span>↕</span>
                    )}
                  </th>
                  <th onClick={() => handleSort("v")}>
                    24h Volume{" "}
                    {sortKey === "v" ? (
                      direction === "asc" ? (
                        "▲"
                      ) : (
                        "▼"
                      )
                    ) : (
                      <span>↕</span>
                    )}
                  </th>
                  <th onClick={() => handleSort("m")}>
                    Market Cap{" "}
                    {sortKey === "m" ? (
                      direction === "asc" ? (
                        "▲"
                      ) : (
                        "▼"
                      )
                    ) : (
                      <span>↕</span>
                    )}
                  </th>
                  {/* <th onClick={() => handleSort("market_cap")}>
                Market Cap{" "}
                {sortKey === "market_cap" ? (
                  direction === "asc" ? (
                    "▲"
                  ) : (
                    "▼"
                  )
                ) : (
                  <span>↕</span>
                )}
              </th> */}
                </tr>
                {_coins &&
                  _coins?.map((item, index) => (
                    <tr
                      key={index}
                      onClick={() => router.push(`/coin/${item?.i}`)}
                      className="cursor-pointer"
                    >
                      <td>
                        <div className="flex gap-3 items-center">
                          <span>
                            <Image
                              src="/images/star.png"
                              width={15}
                              height={15}
                              alt=""
                            />
                          </span>
                          <span>{item?.r}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-3 items-center">
                          <Image
                            src={item?.ic}
                            width={30}
                            height={30}
                            alt=""
                            unoptimized
                          />
                          <span> {item?.n}</span>
                        </div>
                      </td>
                      <td>{formatCurrency(item?.pu)}</td>
                      <td>
                        <span
                          className={
                            item.p1h > 0 ? "text-green-500" : "text-red-500"
                          }
                        >
                          {item.p1h > 0 ? "▲" : "▼"}
                          {Math.abs(item.p1h).toFixed(2)}
                        </span>
                      </td>
                      <td>
                        <span
                          className={
                            item.p24 > 0 ? "text-green-500" : "text-red-500"
                          }
                        >
                          {item.p24 > 0 ? "▲" : "▼"}
                          {Math.abs(item.p24).toFixed(2)}
                        </span>
                      </td>
                      <td>{shortNumber(item?.v)}</td>
                      <td>{shortNumber(item?.m)}</td>
                      {/* <td style={{ width: "150px" }}>
                    <CryptoChart coinId={item?.id} />
                  </td> */}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <PaginatedItems
            total={24281}
            pagination={pagination}
            setPagination={setPagination}
          />
        </div>
      )}
    </>
  );
}
