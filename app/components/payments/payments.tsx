"use client";

import React from "react";
import classNames from "classnames/bind";
import styles from "./payments.module.scss";
import { Space, Table, Tag, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
const cx = classNames.bind(styles);

interface IProps {
  className?: string;
}

const Payments = ({ className }: IProps) => {
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

  const columns: ColumnsType<DataType> = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Transaction",
      dataIndex: "transaction",
      key: "transaction",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "tags",
      render: (_, { status }) => (
        <>
          {status.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "awaiting payment") {
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
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button disabled={record?.status[0] === "paid"} type={"primary"}>
            Pay
          </Button>
        </Space>
      ),
    },
  ];

  const data: DataType[] = [
    {
      key: "1",
      date: "1 feb 2023",
      transaction: "7cGbp2VjNiGiM1VFXMrfZ7S5NwWSF91FfFhu1dQBSXb1",
      amount: 32,
      status: ["paid"],
    },
    {
      key: "1",
      date: "1 mar 2023",
      transaction: "-",
      amount: 32,
      status: ["awaiting payment"],
    },
  ];

  return (
    <div className={classes}>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default Payments;
