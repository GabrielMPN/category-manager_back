import { Router } from "express";
import { CriaCategoria, AtualizaCategoria, BuscaCategoria, DeletaCategoria } from "./CategoriaController";

const router = Router();

router.post("/", CriaCategoria.validar, CriaCategoria.criar);
router.get("/", BuscaCategoria.filtrar);
router.put("/:id", AtualizaCategoria.atualizar);
router.delete("/:id", DeletaCategoria.deletar);

export default { router };