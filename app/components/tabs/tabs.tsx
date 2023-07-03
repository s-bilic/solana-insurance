"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsProps, Alert } from "../../lib/antd";
import Payments from "../payments/payments";
import Claims from "../claims/claims";
import FormClaim from "../formClaim/formClaim";
import { useSession } from "next-auth/react";
import { Keypair } from "@solana/web3.js";
import { useAtom } from "jotai";
import {
  submittedClaimAtom,
  paymentsAtom,
  submittedPaymentAtom,
} from "../../utils/atom";

const CustomTabs = () => {
  const { data: session } = useSession();
  const [submittedClaim, setSubmittedClaim] = useAtom(submittedClaimAtom);
  const [payments, setPayments] = useAtom(paymentsAtom);
  const [completedPayment, setCompletedPayment] = useState(true);
  const [submittedPayment, setSubmittedPayment] = useAtom(submittedPaymentAtom);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Overview`,
      children: (
        <div>
          <Claims />
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
      disabled: !completedPayment,
      children: <FormClaim submitted={(e) => setSubmittedClaim(e)} />,
    },
  ];

  useEffect(() => {
    setSubmittedClaim(false);
  }, [submittedClaim]);

  const fetchPayments = async () => {
    if (session) {
      setTimeout(async () => {
        const response = await fetch(
          `/api/payment?address=${session?.publicKey}`
        );
        const data = await response.json();
        setPayments(data);
        setCompletedPayment(data?.find((item) => item?.completed === true));
      }, 2000);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [session, submittedPayment]);

  console.log(completedPayment);
  return (
    <>
      <Tabs
        defaultActiveKey={"1"}
        activeKey={submittedClaim ? "1" : undefined}
        items={items}
      />
      {!completedPayment && session && (
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
