"use client";
import React from "react";
import { ToastContainer } from "react-toastify";

interface IProps {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: IProps) {
  return (
    <>
      {children}
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}
