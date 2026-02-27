# Documentação de Rotas — Backend (proj_pizza)

Este arquivo lista detalhadamente todas as rotas do backend, incluindo o método HTTP,
o caminho, middlewares aplicados, controllers e serviços responsáveis, bem como os parâmetros esperados.

## Tabela de rotas

| Método | Rota | Middlewares | Controller → Service | Parâmetros & Observações |
|--------|------|-------------|----------------------|-------------------------|
| POST   | `/users` | nenhum | `CreateUserController` → `CreateUserService` | Cria um usuário. Body: `name` (string), `email` (string), `password` (string).
| POST   | `/session` | nenhum | `AuthUserController` → `AuthUserService` | Autenticação. Body: `email`, `password`. Retorna token JWT.
| GET    | `/me` | `isAuthenticated` | `DetailUserController` → `DetailUserService` | Retorna dados do usuário do token.
| POST   | `/category` | `isAuthenticated`, `isAdmin` | `CreateCategoryController` → `CreateCategoryService` | Body: `name`. Cria nova categoria.
| GET    | `/category` | `isAuthenticated` | `ListCategoryController` → `ListCategoryService` | Lista todas as categorias.
| POST   | `/product` | `isAuthenticated`, `isAdmin`, upload single `file` | `CreateProductController` → `CreateProductService` | Cria produto. Body: `name`, `price` (int centavos), `description`, `category_id`; arquivo `file` enviado via multipart para banner.
| GET    | `/products` | `isAuthenticated` | `ListProductController` → `ListProductService` | Query: `disabled` (bool). Lista produtos, padrão `false`.
| DELETE | `/product/:id` | `isAuthenticated`, `isAdmin` | `DeleteProductController` → `DeleteProductService` | Path param `id` (int). Remove produto.
| GET    | `/category/product` | `isAuthenticated` | `ListProductsByCategoryController` → `ListProductsByCategoryService` | Query: `category_id` (int). Retorna produtos habilitados da categoria.
| POST   | `/order` | `isAuthenticated` | `CreateOrderController` → `CreateOrderService` | Cria pedido. Body: `table` (int), `name?` (string opcional).
| GET    | `/orders` | `isAuthenticated` | `ListOrderController` → `ListOrderService` | Lista pedidos com estados internos (draft, status).
| DELETE | `/order` | `isAuthenticated` | `DeleteOrderController` → `DeleteOrderService` | Query: `order_id` (int). Exclui pedido.
| POST   | `/order/add` | `isAuthenticated` | `AddItemOrderController` → `AddItemOrderService` | Adiciona item. Body: `order_id`, `product_id`, `amount`.
| DELETE | `/order/remove` | `isAuthenticated` | `RemoveItemOrderController` → `RemoveItemOrderService` | Query: `item_id`. Remove item de pedido.
| GET    | `/order/detail` | `isAuthenticated` | `OrderDetailController` → `OrderDetailService` | Query: `order_id`. Retorna pedido detalhado com itens e produtos.
| PUT    | `/order/send` | `isAuthenticated` | `SendOrderController` → `SendOrderService` | Body: `order_id`. Marca pedido como enviado (`draft = false`).
| PUT    | `/order/finish` | `isAuthenticated` | `FinishOrderController` → `FinishOrderService` | Body: `order_id`. Marca pedido como pronto (`status = true`).

> **Nota:** todos os endpoints têm validações de entrada implementadas com Zod
> (`validateSchema`). Os campos obrigatórios e tipos são verificados antes de chegar
> ao controller.

## Observações gerais

- A arquitetura segue o fluxo: **rota → controller → service → Prisma/BD**.
- Controllers funcionam como adaptadores HTTP e apenas repassam dados para os services.
- Services contêm toda a lógica de negócio e manipulam os modelos Prisma.
- Middlewares comuns:
  - `isAuthenticated` (verifica JWT e popula `req.user_id`).
  - `isAdmin` (verifica role do usuário em `prisma.user`).
  - `validateSchema(schema)` aplica validações Zod em `body`, `query` e `params`.
- Upload de imagens para produtos utiliza `multer` e configurações em `src/config/cloudinary.ts`.

Este documento serve como referência rápida para desenvolvedores e para futuras
integrações com front-end ou testes automatizados.