"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsProps } from "../../lib/antd";
import Payments from "../payments/payments";
import Claims from "../claims/claims";
import FormClaim from "../formClaim/formClaim";

const CustomTabs = ({ claimsData }) => {
  const [submitted, setSubmitted] = useState(false);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Overview`,
      children: (
        <div>
          <Claims items={claimsData} addedClaim={submitted} />
        </div>
      ),
    },
    {
      key: "2",
      label: `Payments`,
      children: <Payments />,
    },
    {
      key: "3",
      label: `Submit claim`,
      children: <FormClaim submitted={(e) => setSubmitted(e)} />,
    },
  ];

  useEffect(() => {
    if (submitted) {
      setSubmitted(false);
    }
    console.log(submitted);
  }, [submitted]);

  return (
    <Tabs
      defaultActiveKey={"1"}
      activeKey={submitted ? "1" : undefined}
      items={items}
    />
  );
};

export default CustomTabs;
