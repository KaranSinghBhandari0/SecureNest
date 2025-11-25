"use client";

import React, { createContext, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export const DocContext = createContext();

export const DocProvider = ({ children }) => {

  // CREATE DOCUMENT
  const createDocument = async (docData) => {
    console.log("Creating document with data:", docData);
    try {
      const res = await axios.post('/api/document', docData);
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Server Error");
    }
  };

  // UPDATE DOCUMENT

  // DELETE DOCUMENT
  return (
    <DocContext.Provider
      value={{
        createDocument,
      }}
    >
      {children}
    </DocContext.Provider>
  );
};
