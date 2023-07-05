"use client";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./underwriterClaims.module.scss";
import { Button, Table, Select, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

interface IProps {
  className?: string;
  title?: string;
}

const UnderwriterClaims = ({ className, data }: IProps) => {
  const [underwriterClaims, setUnderwriterClaims] = useState(data);
  const { data: session } = useSession();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);

  const [loading, setLoading] = useState(false);

  interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
  }

  const handleChange = (value: string, id: number) => {
    const updatedData = underwriterClaims?.map((item) => {
      if (item?.id === id) {
        return {
          ...item,
          status: value,
        };
      }
      return item;
    });

    setUnderwriterClaims(updatedData);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Subject",
      dataIndex: "subject",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Transaction",
      dataIndex: "transaction",
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
      title: "Status",
      dataIndex: "status",
      render: (value, { id, status }) => (
        <Select
          defaultValue={status}
          status={
            value === "denied"
              ? "error"
              : value === "reviewing"
              ? "warning"
              : ""
          }
          style={{ width: 120 }}
          onChange={(value) => handleChange(value, id)}
          options={[
            { value: "approved", label: "Approved" },
            { value: "reviewing", label: "Reviewing" },
            { value: "denied", label: "Denied" },
          ]}
        />
      ),
    },
  ];

  const rows: DataType[] = underwriterClaims?.map((item, index) => ({
    ...item,
    key: index,
    date: new Date(item?.date).toLocaleDateString(),
  }));

  const classes = cx(
    {
      underwriterClaims: true,
    },
    className
  );

  const updateClaims = async () => {
    const body = selectedRows;

    if (session) {
      const response = await toast.promise(
        fetch(`/api/claim`, {
          method: "PUT",
          body: JSON.stringify(body),
        }),
        {
          success: "Claim updated",
          pending: "Processing...",
          error: "Something went wrong",
        }
      );

      await response.json();
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  useEffect(() => {
    const selectedRowsData = underwriterClaims?.filter((item, index) =>
      selectedRowKeys.includes(index)
    );

    setSelectedRows(selectedRowsData);
  }, [selectedRowKeys, underwriterClaims]);

  console.log(selectedRows);
  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div className={classes}>
      <h6
        className={styles.title}
      >{`Claims (${underwriterClaims?.length})`}</h6>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "15px 0",
        }}
      >
        <Button
          type="primary"
          onClick={updateClaims}
          disabled={!hasSelected}
          loading={loading}
        >
          Save changes
        </Button>
        <span>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
        </span>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={rows}
        pagination={{ position: ["bottomCenter"] }}
      />
    </div>
  );
};

export default UnderwriterClaims;
