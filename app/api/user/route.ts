import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { address } = await req.json();

  // Create user
  const data = await prisma.user.upsert({
    where: { address },
    create: { address },
    update: {},
  });

  // Check if user with payments data already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      address: address,
    },
    include: {
      payments: true,
    },
  });

  // Create the default payments data set for each user.
  if (!existingUser || existingUser.payments.length === 0) {
    await prisma.payment.create({
      data: {
        date: new Date(),
        transaction: "-",
        amount: 0.01,
        completed: false,
        user: {
          connect: {
            address: address,
          },
        },
      },
    });
  }

  return NextResponse.json(data);
}
