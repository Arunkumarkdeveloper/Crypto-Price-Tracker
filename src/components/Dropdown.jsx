"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { handleClickAway } from "@/lib/utils/handleClickAway";

export const Dropdown = ({
  trigger,
  items = [],
  triangle = true,
  dropdownStyle = {},
  top,
  right,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    handleClickAway(dropdownRef, setIsOpen);
  }, []);

  return (
    <div className="cursor-pointer dropdown" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        style={{ display: "flex", alignItems: "center", columnGap: "7px" }}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          className="dropdown-content font-size-12"
          style={{
            position: "absolute",
            top: top,
            zIndex: 98,
            ...dropdownStyle,
          }}
        >
          {triangle && (
            <Image
              src="/images/triangle.svg"
              width={12}
              height={12}
              alt=""
              style={{
                position: "absolute",
                top: "-10px", // closer to dropdown
                right: "15px", // center horizontally
                transform: "translateX(-50%)", // adjust for own width
              }}
            />
          )}

          {items.map((item, index) => (
            <div
              key={index}
              className={`dropdown-content-list ${
                index === 0 ? "mt-0" : "mt-20"
              }`}
              onClick={() => {
                item.onClick?.();
                setIsOpen(false);
              }}
            >
              <span style={{ width: "20%" }}>
                <Image
                  src={item.icon}
                  width={item.iconWidth || 20}
                  height={item.iconHeight || 20}
                  alt={item.label}
                />
              </span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};