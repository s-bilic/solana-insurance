"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
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

const FormClaim = ({ className, submitted }: IProps) => {
  const formRef = React.createRef();
  const [form] = Form.useForm();
  const [submittedClaim, setSubmittedClaim] = useState(false);
  const { data: session } = useSession();
  const classes = cx(
    {
      formClaim: true,
    },
    className
  );
  const onFinish = async (values: any) => {
    form.resetFields();
    const body = {
      date: values?.date,
      subject: values?.subject,
      description: values?.description,
      value: values?.cost,
      address: session?.publicKey,
    };
    console.log(body, "xd");
    await fetch("/api/claim", {
      method: "POST",
      body: JSON.stringify(body),
    });
    setSubmittedClaim(true);
    formRef?.current.resetFields();
  };

  useEffect(() => {
    if (submitted) {
      submitted(submittedClaim);
    }
  }, [submittedClaim]);

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
