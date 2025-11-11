import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ error: "id invalide" });

  if (req.method === "GET") {
    const church = await prisma.church.findUnique({ where: { id } });
    if (!church) return res.status(404).json({ error: "Non trouvé" });
    return res.json(church);
  } else if (req.method === "PATCH") {
    const data = req.body;
    const updated = await prisma.church.update({
      where: { id },
      data: {
        name: data.name,
        logoUrl: data.logoUrl,
        photos: data.photos,
        country: data.country,
        city: data.city,
        province: data.province,
        neighborhood: data.neighborhood,
        addressReference: data.addressReference,
        description: data.description,
        phone1: data.phone1,
        phone2: data.phone2,
        email: data.email,
        socials: data.socials ? data.socials : undefined,
        lat: data.lat ? Number(data.lat) : undefined,
        lng: data.lng ? Number(data.lng) : undefined,
        isVisible: data.isVisible === undefined ? undefined : Boolean(data.isVisible)
      }
    });
    return res.json(updated);
  } else if (req.method === "DELETE") {
    await prisma.church.delete({ where: { id } });
    return res.json({ ok: true });
  } else {
    res.setHeader("Allow", "GET, PATCH, DELETE");
    res.status(405).end();
  }
}