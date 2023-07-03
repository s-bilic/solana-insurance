"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsProps, Alert } from "../../lib/antd";
import Payments from "../payments/payments";
import Claims from "../claims/claims";
import FormClaim from "../formClaim/formClaim";
import { useSession } from "next-auth/react";
import { useAtom } from "jotai";
import { submittedClaimAtom, submittedPaymentAtom } from "../../utils/atom";

const CustomTabs = () => {
  const { data: session } = useSession();
  const [submittedClaim, setSubmittedClaim] = useAtom(submittedClaimAtom);
  const [submittedPayment] = useAtom(submittedPaymentAtom);

  const [payments, setPayments] = useState([]);
  const [completedPayment, setCompletedPayment] = useState(true);

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
      children: <Payments data={payments} />,
    },
    {
      key: "3",
      label: `Submit claim`,
      disabled: !completedPayment,
      children: <FormClaim />,
    },
  ];

  useEffect(() => {
    setSubmittedClaim(false);
  }, [submittedClaim]);

  const fetchPayments = async () => {
    if (session) {
      const response = await fetch(
        `/api/payment?address=${session?.publicKey}`
      );
      const data = await response.json();

      setPayments(data);
      setCompletedPayment(data?.find((item) => item?.completed === true));
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [session, submittedPayment]);

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
