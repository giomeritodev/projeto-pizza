import cors from "cors"
import "dotenv/config"
import express from "express"

//Importando as rotas
import { router } from "./routes"

const app = express()

app.use(express.json())
app.use(cors())
app.use(router)

const port = process.env.PORT || 3333;

app.listen(port, () => {
    console.log("Servidor rodando na porta %s", port)
})