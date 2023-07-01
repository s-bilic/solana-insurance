import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useCallback, useState } from "react";
LAMPORTS_PER_SOL;

const SendSolana = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [confirmed, setConfirmed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [signature, setSignature] = useState("");

  const init = useCallback(
    async (amount: number) => {
      setProcessing(true);
      setConfirmed(false);
      setSignature("");

      if (!publicKey) throw new WalletNotConnectedError();

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: Keypair.generate().publicKey,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );
      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();

      const signature = await sendTransaction(transaction, connection, {
        minContextSlot,
      });

      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });
      setProcessing(false);
      setConfirmed(true);
      setSignature(signature);
    },
    [publicKey, sendTransaction, connection]
  );

  return { init, confirmed, processing, signature };
};

export default SendSolana;
