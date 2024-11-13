import express from 'express';
import basicAuth from 'express-basic-auth';
import * as models from './core/models';
import * as routes from './core/routes';
import { setupSwagger } from './swagger';
import cors from 'cors';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

models.sincronizar();

app.use(cors({ origin: true, credentials: true }));

setupSwagger(app);

app.use(basicAuth({
    users: { [process.env.BASIC_AUTH_USER]: process.env.BASIC_AUTH_PASSWORD }
}))

app.use(express.json());

//Rotas antes das autenticações
app.use("/categoria", routes.CategoriaRouter.router);
app.use("/categoriaFilha", routes.CategoriaFilhaRouter.router);

app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`)
});