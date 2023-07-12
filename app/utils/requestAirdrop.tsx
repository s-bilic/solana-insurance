import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useCallback, useState } from "react";

const AirdropSolana = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [confirmed, setConfirmed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [signature, setSignature] = useState("");

  const init = useCallback(async () => {
    setProcessing(true);
    setConfirmed(false);
    setSignature("");

    if (!publicKey) throw new WalletNotConnectedError();

    const {
      context: { slot: minContextSlot },
      value: { blockhash, lastValidBlockHeight },
    } = await connection.getLatestBlockhashAndContext();

    const signature = await connection.requestAirdrop(
      publicKey,
      LAMPORTS_PER_SOL
    );

    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature,
    });

    setProcessing(false);
    setConfirmed(true);
    setSignature(signature);
  }, [publicKey, sendTransaction, connection]);

  return { init, confirmed, processing, signature };
};

export default AirdropSolana;
