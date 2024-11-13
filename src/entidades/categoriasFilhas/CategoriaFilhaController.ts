import { Request, Response, NextFunction } from "express";
import { CriaPadrao, BuscaPadrao, AtualizaPadrao, DeletaPadrao } from "../../core/CrudPadrao";
import { CategoriaFilha } from "./CategoriaFilha";
import { RetornoHttp } from "../../core/RetornoHttp";
import { Categoria } from "../categorias/Categoria";

export class CriaCategoriaFilha {
  public static async validar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const entidade = req.body;
    let retornoHttp: RetornoHttp = null;

    try {
      const categoria = await Categoria.findOne({
        where: {
          id: entidade.idCategoria
        }
      });

      if (!categoria) {
        retornoHttp = {
          mensagem: "Categoria não encontrada.",
          obs: null,
          status: 400,
        };
        return res.status(retornoHttp.status).json(retornoHttp);
      }

      const categoriaFilhaExistente = await CategoriaFilha.findOne({
        where: {
          nome: entidade.nome,
          idCategoria: entidade.idCategoria,
          status: "ATIVO"
        }
      });

      if (categoriaFilhaExistente) {
        retornoHttp = {
          mensagem: "Não é permitido existir duas categorias filhas com o mesmo nome para o mesmo pai.",
          obs: null,
          status: 400,
        };
        return res.status(retornoHttp.status).json(retornoHttp);
      }

      const numeroDeFilhas = await CategoriaFilha.count({
        where: {
          idCategoria: entidade.idCategoria,
          status: "ATIVO"
        }
      });

      if (numeroDeFilhas >= 20) {
        retornoHttp = {
          mensagem: "Uma categoria pai não pode ter mais de 20 filhas.",
          obs: null,
          status: 400,
        };
        return res.status(retornoHttp.status).json(retornoHttp);
      }

      next();
    } catch (error) {
      retornoHttp = {
        mensagem: "Erro ao verificar a categoria filha.",
        obs: error.message,
        status: 500,
      };
      return res.status(retornoHttp.status).json(retornoHttp);
    }
  }

  public static async criar(req: Request, res: Response): Promise<Response | void> {
    return await CriaPadrao.criarPadrao(req, res, CategoriaFilha);
  }
}

export class BuscaCategoriaFilha {
  public static async filtrar(req: Request, res: Response): Promise<Response | void> {
    return await BuscaPadrao.filtrarPadrao(req, res, CategoriaFilha);
  }
}

export class AtualizaCategoriaFilha {
  public static async atualizar(req: Request, res: Response): Promise<Response | void> {
    return await AtualizaPadrao.atualizarPadrao(req, res, CategoriaFilha);
  }
}

export class DeletaCategoriaFilha {
  public static async deletar(req: Request, res: Response): Promise<Response | void> {
    return await DeletaPadrao.deletarPadrao(req, res, CategoriaFilha);
  }
}