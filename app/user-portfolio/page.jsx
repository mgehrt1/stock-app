"use client";

import React from "react";
import { Portfolio } from "@app/components/portfolio";
import { UserAuth } from "@app/context/AuthContext";

const UserPortfolio = () => {
  const { user } = UserAuth();

  return (
    <div>
      <Portfolio />
    </div>
  );
};

export default UserPortfolio;
