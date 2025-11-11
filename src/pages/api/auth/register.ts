import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { firstName, lastName, email, phone, country, password, role, superSecret } = req.body;
    if (!firstName || !lastName || !email || !password || !country) {
      return res.status(400).json({ error: "Champs obligatoires manquants" });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email déjà utilisé" });

    let isApproved = false;
    if (role === "SUPERADMIN") {
      if (process.env.INITIAL_SUPERADMIN_SECRET && superSecret === process.env.INITIAL_SUPERADMIN_SECRET) {
        isApproved = true;
      } else {
        isApproved = false;
      }
    } else {
      isApproved = false;
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        country,
        password: hash,
        role: role === "SUPERADMIN" ? "SUPERADMIN" : "CONTENT_ADMIN",
        isApproved
      }
    });

    // TODO: send email to SuperAdmins for approval
    return res.status(201).json({ id: user.id, isApproved: user.isApproved });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}