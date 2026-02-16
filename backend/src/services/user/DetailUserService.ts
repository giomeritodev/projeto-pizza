import { prisma } from "../../prisma"

class DetailUserService {
    async execute(user_id: number) {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    id: user_id
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                }
            })
            if (!user) {
                throw new Error("Usuário não encontrado")
            }
            return user;

        } catch (error) {
            throw new Error("Usuário não encontrado.")
        }
    }
}

export { DetailUserService }