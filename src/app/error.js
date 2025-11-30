"use client"; 
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="layout-center">
      <div className="mt-100 mb-100">
        <h2 className="mb-12">Something went wrong!</h2>
        <button className="btn" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </div>
  );
}
