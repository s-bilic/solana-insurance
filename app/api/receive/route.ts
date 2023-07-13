import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
import idl from "../../utils/idl.json";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { getServerSession } from "next-auth";
import { authOptions } from "app/lib/auth";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(authOptions);
  const { claimId } = await req.json();
  const solanaNetwork = "https://api.devnet.solana.com";
  const connection = new Connection(solanaNetwork);

  if (!session) {
    return NextResponse.json({ message: "Not authenticated" });
  }

  // Sender's wallet address and private key
  const fromAccount = Keypair.fromSecretKey(
    new Uint8Array(process.env.PRIVATE_WALLET.split(",").map(Number))
  );
  // Connected user wallet address
  const toAccount = new PublicKey(session?.user?.name as string);

  // Anchor provider setup
  const wallet = new Wallet(fromAccount);
  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: "processed",
  });
  const program = new Program(idl, idl.metadata.address, provider);

  // Claimable amount (0.01 SOL)
  const lamports = new BN(10000000);

  // Smart contract program
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
}
