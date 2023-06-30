"use client";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./claims.module.scss";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Card, Button, Row, Col, Space, Descriptions, Tag } from "antd";
import ReceiveSolana from "../../utils/receiveSolana";
const cx = classNames.bind(styles);

interface IProps {
  className?: string;
  title?: string;
}

const Claims = ({ className, addedClaim }: IProps) => {
  const [claims, setClaims] = useState([]);
  const { data: session } = useSession();
  const { init, processing, confirmed, signature } = ReceiveSolana();
  const classes = cx(
    {
      claims: true,
    },
    className
  );

  const fetchClaims = async () => {
    if (session) {
      const response = await fetch(`/api/claim?address=${session?.publicKey}`, {
        method: "GET",
      });

      const data = await response.json();
      setClaims(data);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [addedClaim, session]);

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
                    <Button key={"button"} type={"primary"}>
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
