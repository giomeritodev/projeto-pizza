import { Router } from "express"
import { CreateUserController } from "./controllers/user/CreateUserController"
import { validateSchema } from "./middlewares/validateSchema"
import { createUserSchema, authUserSchema } from "./schemas/userSchema"
import { AuthUserController } from "./controllers/user/AuthUserController"

const router = Router()

//Rotas de Usuários
router.post("/users", validateSchema(createUserSchema), new CreateUserController().handle)
router.post("/session", validateSchema(authUserSchema), new AuthUserController().handle)

export { router }