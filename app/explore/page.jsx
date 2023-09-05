"use client";

import { useState, useEffect } from "react";
import Ticker from "@app/stock/[ticker]/page";
import { Loader } from "@app/components/loader";
import { HiArrowUp } from "react-icons/hi";
import { LookUp } from "@app/components/look-up";
import { Chart } from "@app/components/ticker-chart";
import React from "react";

export default function Explore() {
  return (
    <div className="flex justify-start">
      <LookUp />
    </div>
  );
}
