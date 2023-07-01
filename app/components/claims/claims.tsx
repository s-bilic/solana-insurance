"use client";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./claims.module.scss";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Card, Button, Row, Col, Space, Descriptions, Tag } from "antd";
const cx = classNames.bind(styles);

interface IProps {
  className?: string;
  title?: string;
}

const Claims = ({ className, addedClaim }: IProps) => {
  const [claims, setClaims] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const { data: session } = useSession();

  const classes = cx(
    {
      claims: true,
    },
    className
  );

  console.log(processing, "p");
  console.log(confirmed, "c");

  const fetchClaims = async () => {
    if (session) {
      const response = await fetch(`/api/claim?address=${session?.publicKey}`, {
        method: "GET",
      });

      const data = await response.json();
      setClaims(data);
    }
  };

  const receiveSolana = async (claimId) => {
    setProcessing(true);
    setConfirmed(false);
    if (session) {
      const body = {
        address: session?.publicKey,
        claimId: claimId,
      };
      const response = await fetch("/api/receive", {
        method: "POST",
        body: JSON.stringify(body),
      });

      const data = await response.json();
      setProcessing(false);
      setConfirmed(true);
      fetchClaims();
      console.log(data);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [addedClaim, session]);
  console.log(claims);

  return (
    <div className={classes}>
      <h6 className={styles.title}>{`Open claims (${claims?.length})`}</h6>
      <div className={styles.items}>
        <Row gutter={[24, 24]}>
          {claims?.map((item, index) => {
            const formattedDate = item?.date ? new Date(item.date) : null;
            return (
              <Col key={index} span={24}>
                <Card
                  style={{ border: "solid 1px #dddddd" }}
                  headStyle={{ borderBottom: "solid 1px #dddddd" }}
                  extra={
                    <Tag icon={<CheckCircleOutlined />} color="success">
                      approved
                    </Tag>
                  }
                  title={item?.subject}
                  {...item}
                >
                  <Space
                    direction="vertical"
                    size="middle"
                    style={{ display: "flex" }}
                  >
                    {item.description}
                    {formattedDate && formattedDate.toLocaleString()}
                    <Descriptions>
                      <Descriptions.Item label="Loss">
                        {item?.value}
                      </Descriptions.Item>
                      <Descriptions.Item label="Covered">$30</Descriptions.Item>
                    </Descriptions>
                    <Button
                      disabled={item?.completed}
                      onClick={() => receiveSolana(item?.id)}
                      key={"button"}
                      type={"primary"}
                    >
                      Claim
                    </Button>
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

export default Claims;
