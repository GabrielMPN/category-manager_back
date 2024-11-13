import { Router } from "express";
import { CriaCategoriaFilha, AtualizaCategoriaFilha, BuscaCategoriaFilha, DeletaCategoriaFilha } from "./CategoriaFilhaController";

const router = Router();

router.post("/", CriaCategoriaFilha.validar, CriaCategoriaFilha.criar);
router.get("/", BuscaCategoriaFilha.filtrar);
router.put("/:id", AtualizaCategoriaFilha.atualizar);
router.delete("/:id", DeletaCategoriaFilha.deletar);

export default { router };