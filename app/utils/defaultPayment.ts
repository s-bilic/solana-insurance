// defaultPayment.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createDefaultPayment() {
  try {
    const existingDefaultPayment = await prisma.payment.findFirst({
      where: {
        completed: false, // Check if a default payment already exists
      },
    });

    if (!existingDefaultPayment) {
      const defaultPayment = await prisma.payment.create({
        data: {
          date: new Date(),
          transaction: "Default Payment",
          amount: 0.01,
          completed: false,
          // Connect the default payment to a default user (if applicable)
          user: {
            connect: {
              id: 1, // Replace with the default user ID or any other identifier you choose
            },
          },
        },
      });

      console.log("Default payment created:", defaultPayment);
    }
  } catch (error) {
    console.error("Error creating default payment:", error);
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma Client
  }
}

export default createDefaultPayment;
