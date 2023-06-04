"use client";

import React from "react";
import classNames from "classnames/bind";
import styles from "./FormClaim.module.scss";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Card,
  DatePicker,
  Select,
  InputNumber,
} from "antd";
const cx = classNames.bind(styles);

interface IProps {
  className?: string;
}

const FormClaim = ({ className }: IProps) => {
  const classes = cx(
    {
      formClaim: true,
    },
    className
  );

  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Card className={classes} title={"Fill in your claim"}>
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
          rules={[{ required: true, message: "Please input the decsription!" }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="Estimated lost value"
          name="cost"
          rules={[{ required: true, message: "Please input the lost value!" }]}
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
  );
};

export default FormClaim;
