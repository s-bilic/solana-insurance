"use client";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { useAtom, atom } from "jotai";
import { submittedClaimAtom } from "../../utils/atom";
import classNames from "classnames/bind";
import styles from "./claims.module.scss";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  TagOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Card, Button, Row, Col, Space, Descriptions, Tag } from "antd";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

interface IProps {
  className?: string;
  title?: string;
}

const Claims = ({ className }: IProps) => {
  const [submittedClaim] = useAtom(submittedClaimAtom);
  const [claims, setClaims] = useState([]);
  const { data: session } = useSession();

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

  const receiveSolana = async (claimId) => {
    if (session) {
      const body = {
        address: session?.publicKey,
        claimId: claimId,
      };

      const response = new Promise((resolve, reject) => {
        fetch("/api/receive", {
          method: "POST",
          body: JSON.stringify(body),
        })
          .then((res) => res.json())
          .then((data) => resolve(data))
          .catch((err) => reject(err));
      });

      await toast.promise(response, {
        success: "Claimed succesfully",
        pending: "Processing...",
        error: {
          render({ data }) {
            return <div>{data?.message}</div>;
          },
        },
      });

      fetchClaims();
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [session, submittedClaim]);

  return (
    <div className={classes}>
      <h6 className={styles.title}>{`Claims (${claims?.length})`}</h6>
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
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {item?.transaction !== "-" && (
                        <Tag
                          icon={<TagOutlined />}
                          color={"purple"}
                          style={{ display: "flex" }}
                        >
                          <div
                            style={{
                              width: "100%",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: "20ch",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <a
                              href={`https://solana.fm/tx/${item?.transaction}?cluster=devnet-solana`}
                              target={"_blank"}
                            >
                              {item?.transaction}
                            </a>
                          </div>
                        </Tag>
                      )}
                      {item?.status === "approved" && (
                        <Tag icon={<CheckCircleOutlined />} color="success">
                          {item?.status}
                        </Tag>
                      )}
                      {item?.status === "reviewing" && (
                        <Tag icon={<SyncOutlined spin />} color="processing">
                          {item?.status}
                        </Tag>
                      )}
                      {item?.status === "denied" && (
                        <Tag icon={<CloseCircleOutlined />} color="error">
                          {item?.status}
                        </Tag>
                      )}
                    </div>
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
                    <Descriptions size="small">
                      <Descriptions.Item label="Lost value">
                        ${item?.loss}
                      </Descriptions.Item>
                      <Descriptions.Item label="Covered">
                        $1000
                      </Descriptions.Item>
                      <Descriptions.Item label="Date">
                        {formattedDate && formattedDate.toLocaleDateString()}
                      </Descriptions.Item>
                    </Descriptions>

                    <Button
                      disabled={
                        item?.completed ||
                        item?.status === "denied" ||
                        item?.status === "reviewing"
                      }
                      onClick={() => receiveSolana(item?.id)}
                      key={"button"}
                      type={"primary"}
                    >
                      {item?.claim === 0 ? "Claim" : `Claim $${item?.claim}`}
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
