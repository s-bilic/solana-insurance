import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { date, subject, description, completed, value, address } =
    await req.json();

  const data = await prisma.claim.create({
    data: {
      date,
      subject,
      description,
      value,
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

export async function GET(
  req: NextApiRequest,
  { params }: any,
  res: NextApiResponse<any>
) {
  const { searchParams } = new URL(req.url);

  const address = searchParams.get("address");
  const data = await prisma.claim.findMany({
    where: {
      user: {
        address: address as string,
      },
    },
  });

  return NextResponse.json(data);
}
