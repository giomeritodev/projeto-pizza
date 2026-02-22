import { Router } from "express"
import multer from "multer"
import uploadConfig from "./config/multer"
import { CreateUserController } from "./controllers/user/CreateUserController"
import { validateSchema } from "./middlewares/validateSchema"
import { createUserSchema, authUserSchema } from "./schemas/userSchema"
import { AuthUserController } from "./controllers/user/AuthUserController"
import { DetailUserController } from "./controllers/user/DetailUserController"
import { isAuthenticated } from "./middlewares/isAuthenticated"
import { CreateCategoryController } from "./controllers/category/CreateCategoryController"
import { ListCategoryController } from "./controllers/category/ListCategoryController"
import { isAdmin } from "./middlewares/isAdmin"
import { createCategorySchema } from "./schemas/categorySchema"
import { CreateProductController } from "./controllers/product/CreateProductController"

const router = Router()
const upload = multer(uploadConfig)

//Rotas de Usuários
router.post("/users", validateSchema(createUserSchema), new CreateUserController().handle)
router.post("/session", validateSchema(authUserSchema), new AuthUserController().handle)
router.get("/me", isAuthenticated, new DetailUserController().handle)

//Rotas de Categorias
router.post("/category", isAuthenticated, isAdmin, validateSchema(createCategorySchema), new CreateCategoryController().handle)
router.get("/category", isAuthenticated, new ListCategoryController().handle)

//Rotas de Produtos
router.post("/product", isAuthenticated, isAdmin, upload.single("file"), new CreateProductController().handle)

export { router }