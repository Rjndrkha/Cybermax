import { Request, Response } from "express";
import * as NotifService from "../services/notification.service.js";

export const list = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const notifications = await NotifService.getUserNotifications(userId);
    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const read = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID notifikasi wajib diisi!" });
    }

    await NotifService.markAsRead(id);
    res.json({ message: "Notifikasi ditandai telah dibaca" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
