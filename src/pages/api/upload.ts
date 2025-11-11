import type { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import nextConnect from "next-connect";
import AWS from "aws-sdk";
import fs from "fs";
import path from "path";

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const name = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
      cb(null, name);
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    console.error(error);
    res.status(500).json({ error: `Something went wrong: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
});

apiRoute.use(upload.array("files", 6));

apiRoute.post(async (req: any, res: NextApiResponse) => {
  try {
    const files = (req.files || []).map((f: any) => {
      if (process.env.S3_BUCKET && process.env.AWS_ACCESS_KEY_ID) {
        // In a full implementation upload to S3 here.
        // For now return local public path; you can replace with S3 URLs.
      }
      return `/uploads/${f.filename}`;
    });
    res.json({ urls: files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export const config = {
  api: { bodyParser: false }
};

export default apiRoute;