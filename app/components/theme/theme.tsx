import React from "react";
import { ConfigProvider } from "../../lib/antd";

interface IProps {
  children: React.ReactNode;
}

const Theme = ({ children }: IProps) => {
  console.log("Theme rendered");
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#00ff93",
          colorTextLightSolid: "#000",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default Theme;
