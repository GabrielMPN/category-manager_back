import { CriaCategoria } from './CategoriaController';
import { Categoria } from './Categoria';
import { Request, Response, NextFunction } from 'express';

jest.mock('./Categoria');

describe('CriaCategoria', () => {
  describe('validar', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
      req = {
        body: {
          idPai: 1,
          nivel: 1
        }
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      next = jest.fn();
    });

    it('deve retornar erro se a categoria pai não for encontrada', async () => {
      (Categoria.findOne as jest.Mock).mockResolvedValue(null);

      await CriaCategoria.validar(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        mensagem: 'A categoria pai com o id 1 não foi encontrada.',
        obs: null,
        status: 400
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve continuar se a categoria pai for válida', async () => {
      (Categoria.findOne as jest.Mock).mockResolvedValue({
        dataValues: { idPai: null },
        status: "ATIVO"
      });
      (Categoria.count as jest.Mock).mockResolvedValue(2);

      await CriaCategoria.validar(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('deve retornar erro se a categoria tiver mais de 5 níveis de profundidade', async () => {
      (Categoria.findOne as jest.Mock).mockResolvedValue({
        dataValues: { idPai: null },
        status: "ATIVO"
      });
      (Categoria.count as jest.Mock).mockResolvedValue(4);

      await CriaCategoria.validar(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        mensagem: 'A categoria não pode ter mais de 5 níveis de profundidade.',
        obs: null,
        status: 400
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro interno em caso de exceção', async () => {
      (Categoria.findOne as jest.Mock).mockRejectedValue(new Error('Erro de banco de dados'));

      await CriaCategoria.validar(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        mensagem: 'Erro Interno.',
        obs: null,
        status: 500
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});