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
        "Error: devnet limits, retry a few times, try the faucet website or switch to a hotspot",
    });
  };
  return (
    <div>
      <FloatButton.Group shape="square" style={{ right: 40, bottom: 40 }}>
        <Tooltip
          placement="left"
          title="Airdrop SOL tokens (devnet) to your wallet (Does not always work because of devnet limits)"
        >
          <FloatButton icon={<ThunderboltOutlined />} onClick={handleAirdrop} />
        </Tooltip>
        <Tooltip
          placement="left"
          title="Use the faucet website to get SOL tokens (devnet)"
        >
          <FloatButton
            icon={<LinkOutlined />}
            href={"https://solfaucet.com/"}
            target={"_blank"}
          />
        </Tooltip>
      </FloatButton.Group>
    </div>
  );
};

export default FloatingButton;
