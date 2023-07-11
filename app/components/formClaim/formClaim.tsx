"use client";

import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { submittedClaimAtom } from "../../utils/atom";
import classNames from "classnames/bind";
import styles from "./formClaim.module.scss";
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
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

interface IProps {
  className?: string;
}

const FormClaim = ({ className }: IProps) => {
  const [submittedClaim, setSubmittedClaim] = useAtom(submittedClaimAtom);
  const formRef = React.createRef();
  const [form] = Form.useForm();

  const classes = cx(
    {
      formClaim: true,
    },
    className
  );
  const onFinish = async (values: any) => {
    setSubmittedClaim(false);

    form.resetFields();
    const body = {
      date: values?.date,
      subject: values?.subject,
      status: "reviewing",
      transaction: "-",
      description: values?.description,
      loss: values?.cost,
      claim: 0,
      completed: false,
    };

    const response = new Promise((resolve, reject) => {
      fetch("/api/claim", {
        method: "POST",
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });

    await toast.promise(response, {
      success: "New claim created",
      pending: "Processing...",
      error: {
        render({ data }) {
          return <div>{data?.message}</div>;
        },
      },
    });

    setSubmittedClaim(true);
    formRef?.current.resetFields();
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
        onChange={() => setSubmittedClaim(false)}
        ref={formRef}
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
              { value: "Burglary and Theft", label: "Burglary and Theft" },
              { value: "Wind and Hail Damage", label: "Wind and Hail Damage" },
              { value: "Fire Damage", label: "Fire Damage" },
              {
                value: "Property Damage",
                label: "Property Damage",
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
          <InputNumber addonBefore="$" />
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
