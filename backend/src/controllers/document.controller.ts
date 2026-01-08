import { Request, Response } from "express";
import * as DocService from "../services/document.service.js";

export const upload = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "File tidak ditemukan!" });
    }

    if (file.mimetype !== "application/pdf") {
      return res
        .status(400)
        .json({ error: "Hanya file PDF yang diperbolehkan!" });
    }

    const { title, description, documentType } = req.body;

    const docData = {
      title,
      description,
      documentType,
      fileUrl: `/uploads/${file.filename}`,
      version: 1,
      status: "ACTIVE",
    };

    const doc = await DocService.uploadDocument(docData, userId);
    res.status(201).json(doc);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    const { search, page } = req.query;

    const docs = await DocService.getAllDocuments(
      String(search || ""),
      Number(page || 1)
    );
    res.json(docs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const askDelete = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID dokumen wajib diisi!" });
    }

    const userId = (req as any).user.id;
    await DocService.requestDelete(id, userId);
    res.json({
      message: "Request delete terkirim. Menunggu persetujuan Admin.",
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const askReplace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    await DocService.requestReplace(id, userId);

    res.json({
      message: "Request replace terkirim. Menunggu persetujuan Admin.",
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "File baru wajib ada" });

    const fileUrl = `/uploads/${file.filename}`;
    const updatedDoc = await DocService.updateDocumentFile(id, fileUrl);

    res.json({ message: "Versi dokumen diperbarui", data: updatedDoc });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
