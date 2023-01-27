import {prisma} from "../../lib/prisma";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const {title, content} = req.body;
    try {
        await prisma.note.create({
            data: {
                title,
                content
            }

        })
        res.status(200).json({message: "Note created successfully"})
    } catch (error) {
        console.log("Create failure")
    }
}