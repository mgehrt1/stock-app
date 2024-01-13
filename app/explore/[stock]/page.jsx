// // pages/explore/[stock].js
"use client";
import { LookUp } from "@app/components/look-up";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const StockPage = ({ params }) => {
  return <LookUp stock={params.stock} />;
};

export default StockPage;
