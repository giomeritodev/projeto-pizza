import { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma";

export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user_id = req.user_id;

    //Caso não exista usuário
    if (!user_id) {
        res.status(401).json({ error: "Usuário sem permissão" });
        return;
    }
    const user = await prisma.user.findFirst({
        where: {
            id: user_id
        }
    })
    //Caso não exista o usuário ou não for admin
    if (!user || user.role !== "ADMIN") {
        res.status(401).json({ error: "Usuário sem permissão" });
        return;
    }

    //Usuário é admin? sim? então segue...
    next();
}