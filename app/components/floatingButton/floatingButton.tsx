"use client";

import { FloatButton, Tooltip } from "../../lib/antd";
import { LinkOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import AirdropSolana from "app/utils/requestAirdrop";

const FloatingButton = () => {
  const { init } = AirdropSolana();

  const handleAirdrop = async () => {
    await toast.promise(init(), {
      pending: "Airdrop request...",
      success: "Airdrop received!",
      error:
        "Error because of devnet limits, retry a few times, try the faucet website or switch to a hotspot",
    });
  };
  return (
    <div>
      <FloatButton.Group shape="square" style={{ right: 94 }}>
        {/* <FloatButton icon={<QuestionCircleOutlined />} /> */}
        <Tooltip
          placement="left"
          title="Get devnet SOL tokens by using the faucet website"
        >
          <FloatButton
            icon={<LinkOutlined />}
            href={"https://solfaucet.com/"}
            target={"_blank"}
          />
        </Tooltip>
        <Tooltip
          placement="left"
          title="Airdrop devnet SOL tokens directly! (Does not always work because of devnet 24h limits)"
        >
          <FloatButton icon={<ThunderboltOutlined />} onClick={handleAirdrop} />
        </Tooltip>
      </FloatButton.Group>
    </div>
  );
};

export default FloatingButton;
