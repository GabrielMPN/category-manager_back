import { Request, Response, NextFunction } from "express";
import { CriaPadrao, BuscaPadrao, AtualizaPadrao, DeletaPadrao } from "../../core/CrudPadrao";
import { Categoria } from "./Categoria";
import { RetornoHttp } from "../../core/RetornoHttp";

export class CriaCategoria {
  public static async validar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const entidade: Categoria = req.body;
    entidade.nivel = 1;

    try {
      if (entidade.idPai) {
        const categoriaPai: Categoria = await Categoria.findOne({
          where: {
            id: entidade.idPai,
            status: "ATIVO"
          }
        });

        if (!categoriaPai) {
          return res.status(400).json({
            mensagem: `A categoria pai com o id ${entidade.idPai} não foi encontrada.`,
            obs: null,
            status: 400
          });
        }

        if (categoriaPai.dataValues.idPai) {
          return res.status(400).json({
            mensagem: "Esta categoria não pode ser filha de uma categoria filha de outro pai.",
            obs: null,
            status: 400
          });
        }

        const countCategorias: number = await Categoria.count({
          where: {
            idPai: entidade.idPai,
            status: "ATIVO"
          }
        });

        if (countCategorias < 4) {
          entidade.nivel = countCategorias + 2;
        } else {
          return res.status(400).json({
            mensagem: "A categoria não pode ter mais de 5 níveis de profundidade.",
            obs: null,
            status: 400
          });
        }
      }

      return next();

    } catch (e) {
      console.error(e);
      return res.status(500).json({
        mensagem: "Erro Interno.",
        obs: null,
        status: 500
      });
    }
  }

  public static async criar(req: Request, res: Response): Promise<Response | void> {
    return await CriaPadrao.criarPadrao(req, res, Categoria);
  }
}

export class BuscaCategoria {
  public static async filtrar(req: Request, res: Response): Promise<Response | void> {
    return await BuscaPadrao.filtrarPadrao(req, res, Categoria);
  }
}

export class AtualizaCategoria {
  public static async atualizar(req: Request, res: Response): Promise<Response | void> {
    const entidade: Categoria = req.body;
    delete entidade.nivel;
    delete entidade.idPai;

    return await AtualizaPadrao.atualizarPadrao(req, res, Categoria);
  }
}

export class DeletaCategoria {
  public static async deletar(req: Request, res: Response): Promise<Response | void> {
    return await DeletaPadrao.deletarPadrao(req, res, Categoria);
  }
}