import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "app/lib/auth";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(authOptions);

  const {
    date,
    subject,
    status,
    transaction,
    description,
    completed,
    loss,
    claim,
  } = await req.json();

  if (!session) {
    return NextResponse.json({ message: "Not authenticated" });
  }

  const data = await prisma.claim.create({
    data: {
      date,
      subject,
      status,
      transaction,
      description,
      loss,
      claim,
      completed,
      user: {
        connect: {
          address: session?.user?.name as string,
        },
      },
    },
  });

  return NextResponse.json(data);
}

export async function PUT(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(authOptions);
  const items = await req.json();

  // Only underwriters can update claims
  if (
    !process.env.UNDERWRITER_ADDRESS.split(", ").includes(session?.user?.name)
  ) {
    return NextResponse.json({ message: "Not authenticated" });
  }

  try {
    const data = await prisma.$transaction(
      items.map(async (item) => {
        const { id, status, claim } = item;

        await prisma.claim.update({
          where: { id }, // Update the item based on its ID
          data: {
            status,
            claim,
          },
        });
      })
    );
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(e);
  }
}

export async function GET(req: NextApiRequest, res: NextApiResponse<any>) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Not authenticated" });
  }

  const data = await prisma.claim.findMany({
    where: {
      user: {
        address: session?.user?.name as string,
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  return NextResponse.json(data);
}
