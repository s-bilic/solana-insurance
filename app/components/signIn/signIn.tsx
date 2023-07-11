"use client";

import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { SigninMessage } from "../../utils/signInMessage";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import bs58 from "bs58";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SignIn = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const wallet = useWallet();
  const walletModal = useWalletModal();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      if (!wallet.connected) {
        walletModal.setVisible(true);
      }

      const csrf = await getCsrfToken();
      if (!wallet.publicKey || !csrf || !wallet.signMessage) return;

      const message = new SigninMessage({
        domain: window.location.host,
        publicKey: wallet.publicKey?.toBase58(),
        statement: `Sign this message to sign in to the app.`,
        nonce: csrf,
      });

      const data = new TextEncoder().encode(message.prepare());
      const signature = await wallet.signMessage(data);
      const serializedSignature = bs58.encode(signature);

      await signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature: serializedSignature,
      });

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (wallet.connected && status === "unauthenticated") {
      handleSignIn();
    }
  }, [wallet.connected]);

  useEffect(() => {
    if (loading) {
      toast.loading("Signing in...");
    } else {
      toast.dismiss();
    }
  }, [loading]);

  return (
    <div>
      {!session && <WalletMultiButton />}
      {session && (
        <WalletDisconnectButton onClick={() => signOut({ callbackUrl: "/" })} />
      )}
    </div>
  );
};

export default SignIn;
