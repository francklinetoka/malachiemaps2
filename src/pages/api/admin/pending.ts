import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();
  try {
    const pending = await prisma.user.findMany({
      where: { isApproved: false, role: "CONTENT_ADMIN" },
      select: { id: true, firstName: true, lastName: true, email: true, country: true, createdAt: true }
    });
    return res.json(pending);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}