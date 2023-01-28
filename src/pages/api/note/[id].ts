import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const noteId = req.query.id;

  if (req.method === "DELETE") {
    const note = await prisma.note.delete({
      where: {
        id: Number(noteId),
      },
    });
    res.status(200).json(note);
  } else if (req.method === "PUT") {
    const { title, content } = req.body;
    const note = await prisma.note.update({
      where: {
        id: Number(noteId),
      },
      data: {
        title,
        content,
      },
    });
    res.status(200).json(note);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
