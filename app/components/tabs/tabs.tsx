"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsProps, Alert } from "../../lib/antd";
import Payments from "../payments/payments";
import Claims from "../claims/claims";
import FormClaim from "../formClaim/formClaim";
import { useSession } from "next-auth/react";
import { Keypair } from "@solana/web3.js";

const CustomTabs = () => {
  const { data: session } = useSession();
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState();

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Overview`,
      children: (
        <div>
          <Claims addedClaim={submitted} />
        </div>
      ),
    },
    {
      key: "2",
      label: `Payments`,
      children: <Payments paymentStatus={(e) => setStatus(e)} />,
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
  }, [submitted]);

  const completedPayment = status?.find((item) => item.completed === true);

  // let account = Keypair.generate();

  // console.log(account.publicKey.toBase58());
  // console.log(account.secretKey);

  // let array = Array.from(account.secretKey);
  // console.log(array);
  return (
    <>
      <Tabs
        defaultActiveKey={"1"}
        activeKey={submitted ? "1" : undefined}
        items={items}
      />
      {!completedPayment && (
        <Alert
          message="Uncompleted payment"
          description="In order to submit claims, make your payment complete"
          type="warning"
          showIcon
          closable
        />
      )}
    </>
  );
};

export default CustomTabs;
