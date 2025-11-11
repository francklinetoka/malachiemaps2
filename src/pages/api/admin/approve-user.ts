import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
// In production, validate SuperAdmin session here.

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { userId, approve } = req.body;
    if (!userId) return res.status(400).json({ error: "userId requis" });
    const updated = await prisma.user.update({
      where: { id: Number(userId) },
      data: { isApproved: Boolean(approve) }
    });
    return res.json({ id: updated.id, isApproved: updated.isApproved });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}