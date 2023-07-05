import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
import idl from "../../utils/idl.json";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { address, claimId } = await req.json();
    const solanaNetwork = "https://api.devnet.solana.com";
    const connection = new Connection(solanaNetwork);

    // Sender's wallet address and private key
    const fromAccount = Keypair.fromSecretKey(
      new Uint8Array(process.env.PRIVATE_WALLET.split(",").map(Number))
    );
    const toAccount = new PublicKey(address);
    const wallet = new Wallet(fromAccount);
    const provider = new AnchorProvider(connection, wallet, {
      preflightCommitment: "processed",
    });

    const program = new Program(idl, idl.metadata.address, provider);
    const lamports = new BN(1000000);

    const signature = await program.methods
      .transferLamports(lamports)
      .accounts({
        from: fromAccount.publicKey,
        to: toAccount,
      })
      .signers([fromAccount])
      .rpc();

    await prisma.claim.update({
      where: {
        id: claimId,
      },
      data: {
        completed: true,
        transaction: signature,
      },
    });
    // Transaction successful
    return NextResponse.json(signature);
  } catch (error) {
    // Handle errors
    console.error("Solana transfer error:", error);
    return NextResponse.json(error);
  }
}
