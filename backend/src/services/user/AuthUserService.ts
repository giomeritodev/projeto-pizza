import { compare } from "bcryptjs";
import { prisma } from "../../prisma";
import { sign } from "jsonwebtoken";

interface AuthUserServiceProps {
    email: string;
    password: string;
}

class AuthUserService {

    async execute({ email, password }: AuthUserServiceProps) {
        const userExists = await prisma.user.findFirst({
            where: {
                email: email
            }
        })
        if (!userExists) {
            throw new Error("Email/Senha é obrigatório")
        }

        //Verificar se a senha esta correta
        const passwordMatch = await compare(password, userExists.password);
        if (!passwordMatch) {
            throw new Error("Email/Senha é obrigatório")
        }

        //Gerar token JWT
        const token = sign({
            name: userExists.name,
            email: userExists.email,
        }, process.env.JWT_SECRET as string, {
            subject: String(userExists.id),
            expiresIn: "30d",
        })

        return {
            id: userExists.id,
            name: userExists.name,
            email: userExists.email,
            role: userExists.role,
            token: token
        }
    }

}

export { AuthUserService }