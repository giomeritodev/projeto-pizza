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
import { createProductSchema } from "./schemas/productSchema"
import { ListProductController } from "./controllers/product/ListProductController"
import { listProductSchema } from "./schemas/listProductSchema"
import { DeleteProductController } from "./controllers/product/DeleteProductController"
import { deleteProductSchema } from "./schemas/deleteProductSchema"
import { ListProductsByCategoryController } from "./controllers/product/ListProductsByCategoryController"
import { listProductsByCategorySchema } from "./schemas/listProductsByCategorySchema"

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
router.post("/product", isAuthenticated, isAdmin, upload.single("file"), validateSchema(createProductSchema), new CreateProductController().handle)
router.get("/products", isAuthenticated, validateSchema(listProductSchema), new ListProductController().handle)
router.delete("/product/:id", isAuthenticated, isAdmin, validateSchema(deleteProductSchema), new DeleteProductController().handle)
router.get("/category/product", isAuthenticated, validateSchema(listProductsByCategorySchema), new ListProductsByCategoryController().handle)

export { router }