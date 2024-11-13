import { Request, Response, NextFunction } from 'express';
import { CriaCategoriaFilha } from './CategoriaFilhaController';
import { Categoria } from '../categorias/Categoria';
import { CategoriaFilha } from './CategoriaFilha';

jest.mock('./CategoriaFilha');
jest.mock('../categorias/Categoria');

describe('CategoriaValidator', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {
        idCategoria: 1,
        nome: 'Categoria Filha 1',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('deve chamar next() quando todas as validações passarem', async () => {
    (Categoria.findOne as jest.Mock).mockResolvedValue({ id: 1 });
    (CategoriaFilha.findOne as jest.Mock).mockResolvedValue(null);
    (CategoriaFilha.count as jest.Mock).mockResolvedValue(19);

    await CriaCategoriaFilha.validar(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it('deve retornar um erro 400 quando a categoria não for encontrada', async () => {
    (Categoria.findOne as jest.Mock).mockResolvedValue(null);

    await CriaCategoriaFilha.validar(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      mensagem: 'Categoria não encontrada.',
      obs: null,
      status: 400,
    });
  });

  it('deve retornar um erro 400 quando a categoria filha já existir', async () => {
    (Categoria.findOne as jest.Mock).mockResolvedValue({ id: 1 });
    (CategoriaFilha.findOne as jest.Mock).mockResolvedValue({ id: 1 });

    await CriaCategoriaFilha.validar(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      mensagem: 'Não é permitido existir duas categorias filhas com o mesmo nome para o mesmo pai.',
      obs: null,
      status: 400,
    });
  });

  it('deve retornar um erro 400 quando a categoria tiver mais de 20 categorias filhas', async () => {
    (Categoria.findOne as jest.Mock).mockResolvedValue({ id: 1 });
    (CategoriaFilha.findOne as jest.Mock).mockResolvedValue(null);
    (CategoriaFilha.count as jest.Mock).mockResolvedValue(20);

    await CriaCategoriaFilha.validar(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      mensagem: 'Uma categoria pai não pode ter mais de 20 filhas.',
      obs: null,
      status: 400,
    });
  });

  it('deve retornar um erro 500 quando ocorrer um erro', async () => {
    (Categoria.findOne as jest.Mock).mockRejectedValue(new Error('Erro no banco de dados'));

    await CriaCategoriaFilha.validar(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      mensagem: 'Erro ao verificar a categoria filha.',
      obs: 'Erro no banco de dados',
      status: 500,
    });
  });
});