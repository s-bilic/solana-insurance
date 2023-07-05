import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const {
    date,
    subject,
    status,
    transaction,
    description,
    completed,
    value,
    address,
  } = await req.json();

  const data = await prisma.claim.create({
    data: {
      date,
      subject,
      status,
      transaction,
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

export async function PUT(req: NextApiRequest, res: NextApiResponse) {
  const items = await req.json();

  try {
    const data = await prisma.$transaction(
      items.map(async (item) => {
        const { id, status } = item;

        await prisma.claim.update({
          where: { id }, // Update the item based on its ID
          data: {
            status,
          },
        });
      })
    );

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function GET(
  req: NextApiRequest,
  { params }: any,
  res: NextApiResponse<any>
) {
  let data;
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (address) {
    data = await prisma.claim.findMany({
      where: {
        user: {
          address: address as string,
        },
      },
      orderBy: {
        id: "desc",
      },
    });
  } else {
    data = await prisma.claim.findMany({
      orderBy: {
        id: "desc",
      },
    });
  }

  return NextResponse.json(data);
}
