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
import { CreateOrderController } from "./controllers/order/CreateOrderController"
import { createOrderSchema } from "./schemas/createOrderSchema"
import { ListOrderController } from "./controllers/order/ListOrderController"
import { AddItemOrderController } from "./controllers/order/AddItemOrderController"
import { addItemOrderSchema } from "./schemas/addItemOrderSchema"
import { RemoveItemOrderController } from "./controllers/order/RemoveItemOrderController"
import { removeItemOrderSchema } from "./schemas/removeItemOrderSchema"
import { OrderDetailController } from "./controllers/order/OrderDetailController"
import { orderDetailSchema } from "./schemas/orderDetailSchema"
import { SendOrderController } from "./controllers/order/SendOrderController"
import { sendOrderSchema } from "./schemas/sendOrderSchema"

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

//Rotas de Orders
router.post("/order", isAuthenticated, validateSchema(createOrderSchema), new CreateOrderController().handle)
router.get("/orders", isAuthenticated, new ListOrderController().handle)


//Adicionar items a uma order
router.post("/order/add", isAuthenticated, validateSchema(addItemOrderSchema), new AddItemOrderController().handle)
router.delete("/order/remove", isAuthenticated, validateSchema(removeItemOrderSchema), new RemoveItemOrderController().handle)

//Detalhes de uma Order
router.get("/order/detail", isAuthenticated, validateSchema(orderDetailSchema), new OrderDetailController().handle)

router.put("/order/send", isAuthenticated, validateSchema(sendOrderSchema), new SendOrderController().handle)

export { router }