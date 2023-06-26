import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { date, transaction, amount, status, completed, address } =
    await req.json();

  console.log(date, transaction, amount, status, completed, address);

  const data = await prisma.payment.create({
    data: {
      date,
      transaction,
      amount,
      status,
      completed,
      user: {
        connect: {
          address,
        },
      },
    },
  });

  return NextResponse.json(data);
}
