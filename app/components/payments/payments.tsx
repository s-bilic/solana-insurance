"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import classNames from "classnames/bind";
import styles from "./payments.module.scss";
import { Space, Table, Tag, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import SendSolana from "app/utils/sendSolana";
import { useAtom } from "jotai";
import { submittedPaymentAtom } from "../../utils/atom";
import { toast } from "react-toastify";
const cx = classNames.bind(styles);

interface IProps {
  className?: string;
  data?: [];
}

const Payments = ({ className, data }: IProps) => {
  const [submittedPayment, setSubmittedPayment] = useAtom(submittedPaymentAtom);
  const { data: session } = useSession();
  const { init, confirmed, signature } = SendSolana();
  const amount = 0.01;

  const classes = cx(
    {
      payments: true,
    },
    className
  );

  interface DataType {
    key: string;
    date: string;
    transaction: string;
    amount: number;
    status: string[];
  }

  const handlePayment = (amount: any) => {
    init(amount);
  };

  const createPayment = async () => {
    if (session && signature) {
      const body = {
        date: new Date(),
        transaction: signature,
        amount: amount,
        completed: true,
        address: session?.publicKey,
      };

      await toast.promise(
        fetch("/api/payment", {
          method: "POST",
          body: JSON.stringify(body),
        }),
        {
          success: "Payment received",
          pending: "Processing...",
          error: "Something went wrong",
        },
        {
          toastId: "hi",
        }
      );

      setSubmittedPayment(true);
    }
  };

  useEffect(() => {
    if (confirmed) {
      createPayment();
      console.log("paid");
    }
  }, [confirmed]);

  const columns: ColumnsType<DataType> = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: "10%",
    },
    {
      title: "Transaction",
      dataIndex: "transaction",
      key: "transaction",
      render: (text) => (
        <div
          style={{
            width: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "40ch",
            whiteSpace: "nowrap",
          }}
        >
          <a
            href={`https://solana.fm/tx/${text}?cluster=devnet-solana`}
            target={"_blank"}
          >
            {text}
          </a>
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: "10%",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "tags",
      render: (_, { status }) => (
        <>
          {status?.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "awaiting") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
      width: "10%",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => handlePayment(0.01)}
            disabled={record?.status[0] === "paid" || confirmed}
            type={"primary"}
          >
            Pay
          </Button>
        </Space>
      ),
      width: "10%",
    },
  ];

  const rows: DataType[] = data?.map((item, index) => ({
    ...item,
    key: index,
    date: new Date(item?.date).toLocaleDateString(),
    status: item?.completed ? ["paid"] : ["awaiting"],
  }));

  return (
    <div className={classes}>
      <Table columns={columns} dataSource={rows} />
    </div>
  );
};

export default Payments;
