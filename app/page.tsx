"use client";
import { useState } from "react";
import styles from "./styles/page.module.scss";
import { useWallet } from "@solana/wallet-adapter-react";
import User from "./components/user/user";
import Claims from "./components/claims/claims";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  Tabs,
  Button,
  Checkbox,
  Form,
  Input,
  Card,
  DatePicker,
  Select,
  InputNumber,
} from "antd";
import type { TabsProps } from "antd";

export default function Home() {
  const { publicKey } = useWallet();
  const claimsData = [
    {
      title: "Defect computer",
      content:
        "After thourough examination we had to deny this claim, since it appears you tried to clean your computer",
    },
    {
      title: "Stolen Bicycle",
      content:
        "Your before and after pictures are clear evidence that your bicycle has been stolen",
    },
    {
      title: "Stolen Bicycle",
      content:
        "Your before and after pictures are clear evidence that your bicycle has been stolen",
    },
  ];

  const onChange = (key: string) => {
    console.log(key);
  };

  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Overview`,
      children: (
        <div className={styles.claimsWrapper}>
          <Claims
            title={`Open claims (${claimsData?.length})`}
            items={claimsData}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: `Submit claim`,
      children: (
        <Card title={"Fill in your claim"}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: true, message: "Please input the date!" }]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              label="Subject"
              name="subject"
              rules={[{ required: true, message: "Please input the subject!" }]}
            >
              <Select
                placeholder={"Select a value"}
                options={[
                  { value: "theft", label: "Burglary and Theft" },
                  { value: "wind", label: "Wind and Hail Damage" },
                  { value: "fire", label: "Fire Damage" },
                  {
                    value: "customer",
                    label: "Customer Injury and Property Damage",
                  },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please input the decsription!" },
              ]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              label="Estimated lost value"
              name="cost"
              rules={[
                { required: true, message: "Please input the lost value!" },
              ]}
            >
              <InputNumber addonBefore="+" addonAfter="$" defaultValue={100} />
            </Form.Item>

            <Form.Item
              name="agree"
              valuePropName="agree"
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox>I agree with the terms and conditions</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
  ];

  return (
    <main className={styles.main}>
      <div className={styles.fullWidth}>
        <div className={styles.userWrapper}>
          <User address={publicKey?.toBase58()} />
          <WalletMultiButton />
        </div>
      </div>
      <Tabs
        tabBarStyle={{ color: "white" }}
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
      />
    </main>
  );
}
