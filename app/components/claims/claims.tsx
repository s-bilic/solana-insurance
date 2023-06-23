"use client";

import React from "react";
import classNames from "classnames/bind";
import styles from "./claims.module.scss";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Card, Button, Row, Col, Space, Descriptions, Tag } from "antd";
const cx = classNames.bind(styles);

interface IProps {
  className?: string;
  title?: string;
  items?: any;
}

const Claims = ({ className, title, items }: IProps) => {
  const classes = cx(
    {
      claims: true,
    },
    className
  );

  return (
    <div className={classes}>
      {title && <h6 className={styles.title}>{title}</h6>}
      <div className={styles.items}>
        <Row gutter={[24, 24]}>
          {items?.map((item, index) => (
            <Col key={index} span={24}>
              <Card
                style={{ border: "solid 1px #dddddd" }}
                headStyle={{ borderBottom: "solid 1px #dddddd" }}
                extra={
                  <Tag icon={<CheckCircleOutlined />} color="success">
                    approved
                  </Tag>
                }
                {...item}
              >
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ display: "flex" }}
                >
                  {/* <Tag icon={<SyncOutlined spin />} color="processing">
                    in progress
                  </Tag>
                  <Tag icon={<CloseCircleOutlined />} color="error">
                    denied
                  </Tag> */}
                  {item.content}
                  <Descriptions>
                    <Descriptions.Item label="Loss">$50</Descriptions.Item>
                    <Descriptions.Item label="Covered">$30</Descriptions.Item>
                  </Descriptions>
                  <Button key={"button"} type={"primary"}>
                    Claim
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Claims;
