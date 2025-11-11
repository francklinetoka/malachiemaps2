import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { name, country, city, province, neighborhood, page = "1", perPage = "20" } = req.query;
    const where: any = { isVisible: true };
    if (name) where.name = { contains: String(name), mode: "insensitive" };
    if (country) where.country = String(country);
    if (city) where.city = String(city);
    if (province) where.province = String(province);
    if (neighborhood) where.neighborhood = String(neighborhood);
    const pageInt = parseInt(String(page));
    const perPageInt = parseInt(String(perPage));
    const [total, items] = await Promise.all([
      prisma.church.count({ where }),
      prisma.church.findMany({
        where,
        skip: (pageInt - 1) * perPageInt,
        take: perPageInt,
        orderBy: { createdAt: "desc" }
      })
    ]);
    return res.json({ total, items });
  } else if (req.method === "POST") {
    try {
      const payload = req.body;
      const required = ["name", "country", "city", "addressReference", "description", "createdById"];
      for (const f of required) if (!payload[f]) return res.status(400).json({ error: `Champ ${f} manquant` });
      const church = await prisma.church.create({
        data: {
          name: payload.name,
          logoUrl: payload.logoUrl || null,
          photos: payload.photos || [],
          country: payload.country,
          city: payload.city,
          province: payload.province || null,
          neighborhood: payload.neighborhood || null,
          addressReference: payload.addressReference,
          description: payload.description,
          phone1: payload.phone1 || null,
          phone2: payload.phone2 || null,
          email: payload.email || null,
          socials: payload.socials || null,
          lat: payload.lat ? Number(payload.lat) : null,
          lng: payload.lng ? Number(payload.lng) : null,
          createdById: Number(payload.createdById),
          isVisible: payload.isVisible === undefined ? true : Boolean(payload.isVisible)
        }
      });
      return res.status(201).json(church);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  } else {
    res.setHeader("Allow", "GET, POST");
    res.status(405).end();
  }
}