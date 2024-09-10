import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function connectionToDB() {
  try {
    console.log("Conectado a la base de datos exitosamente.");
  } catch (e) {
    console.error("Error connecting to the database:", e);
  } finally {
    await prisma.$disconnect();
  }
}
