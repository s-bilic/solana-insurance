import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useCallback, useState } from "react";
LAMPORTS_PER_SOL;
import idl from "../utils/idl.json";

const ReceiveSolana = () => {
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [confirmed, setConfirmed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [signature, setSignature] = useState("");

  const provider = new AnchorProvider(connection, anchorWallet, {
    preflightCommitment: "processed",
  });
  const program = new Program(idl, idl.metadata.address, provider);

  const init = useCallback(async () => {
    const fromPrivateKey =
      process.env.NEXT_PUBLIC_TREASURY_PRIVATE_KEY.split(",").map(Number);
    setProcessing(true);
    setConfirmed(false);
    setSignature("");
    if (!publicKey) throw new WalletNotConnectedError();

    const {
      context: { slot: minContextSlot },
      value: { blockhash, lastValidBlockHeight },
    } = await connection.getLatestBlockhashAndContext();

    const fromAccount = Keypair.fromSecretKey(new Uint8Array(fromPrivateKey));
    // Send transaction
    const data = new BN(10000000);
    const signature = await program.methods
      .transferLamports(data)
      .accounts({
        from: fromAccount.publicKey,
        to: publicKey,
      })
      .signers([fromAccount])
      .rpc();

    console.log(signature);

    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature,
    });
    setProcessing(false);
    setConfirmed(true);
    setSignature(signature);
  }, [publicKey, connection]);

  return { init, confirmed, processing, signature };
};

export default ReceiveSolana;
