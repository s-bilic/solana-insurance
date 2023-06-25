import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { address } = await req.json();

  const data = await prisma.user.upsert({
    where: { address },
    create: { address },
    update: {},
  });

  return NextResponse.json(data);
}
