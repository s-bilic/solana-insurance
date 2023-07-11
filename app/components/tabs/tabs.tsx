"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsProps, Alert, Empty, Button, Tooltip } from "../../lib/antd";
import Payments from "../payments/payments";
import Claims from "../claims/claims";
import FormClaim from "../formClaim/formClaim";
import { useSession } from "next-auth/react";
import { useAtom } from "jotai";
import { submittedClaimAtom, submittedPaymentAtom } from "../../utils/atom";

const CustomTabs = ({ items }) => {
  const { data: session } = useSession();
  const [submittedClaim, setSubmittedClaim] = useAtom(submittedClaimAtom);
  const [submittedPayment] = useAtom(submittedPaymentAtom);

  const [payments, setPayments] = useState([]);
  const [completedPayment, setCompletedPayment] = useState(true);

  const itemsArray: TabsProps["items"] = items
    ? items
    : [
        {
          key: "1",
          label: `Overview`,
          disabled: !session,
          children: (
            <div>
              {!session ? (
                <Empty
                  description={"Connect your wallet to enable all features"}
                  style={{
                    border: "dashed 1px #c5c5c5",
                    borderRadius: 8,
                    padding: 40,
                  }}
                >
                  <Tooltip title="Don't have a wallet yet?">
                    <Button
                      href="https://phantom.app/"
                      type="primary"
                      target={"_blank"}
                    >
                      Download Wallet
                    </Button>
                  </Tooltip>
                </Empty>
              ) : (
                <Claims />
              )}
            </div>
          ),
        },
        {
          key: "2",
          label: `Payments`,
          disabled: !session,
          children: <Payments data={payments} />,
        },
        {
          key: "3",
          label: `Submit claim`,
          disabled: !completedPayment || !session,
          children: <FormClaim />,
        },
      ];

  useEffect(() => {
    setSubmittedClaim(false);
  }, [submittedClaim]);

  const fetchPayments = async () => {
    if (session) {
      const response = await fetch(`/api/payment`);
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
        items={itemsArray}
      />
      {!completedPayment && session && !items && (
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
