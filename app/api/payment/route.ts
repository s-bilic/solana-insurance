import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { date, transaction, amount, completed, address } = await req.json();

  console.log(date, transaction, amount, completed, address);

  if (amount === 0.01) {
    // Check if the payment already exists based on the address
    const existingPayment = await prisma.payment.findFirst({
      where: {
        user: {
          address: address,
        },
      },
    });

    if (existingPayment) {
      const updatedPayment = await prisma.payment.update({
        where: {
          id: existingPayment.id,
        },
        data: {
          date,
          transaction,
          amount,
          completed,
        },
      });
      return NextResponse.json(updatedPayment);
    }
  }
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { searchParams } = new URL(req.url);

  const address = searchParams.get("address");
  const data = await prisma.payment.findMany({
    where: {
      user: {
        address: address as string,
      },
    },
  });

  return NextResponse.json(data);
}
