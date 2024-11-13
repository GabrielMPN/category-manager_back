import { NextFunction, Request, Response } from 'express';
import * as fs from 'fs';
import { QueryTypes, Sequelize } from 'sequelize';
import { RetornoHttp } from "./RetornoHttp";
import conexaoInterna from "../entidades/conexaoInterna";

export class BuscaJson {
    public static async buscarArquivo(req: Request, res: Response, caminhoArquivo): Promise<Response | void> {
        let httpResponse: RetornoHttp = new RetornoHttp();
        fs.readFile(caminhoArquivo, 'utf8', (err, data) => {
            if (err) {
                httpResponse = {
                    mensagem: "Erro interno",
                    obs: null,
                    status: 500
                }
                console.error('Erro ao ler o arquivo JSON:', err);

                return res.status(httpResponse.status).json(httpResponse);
            }

            const conteudoJson = JSON.parse(data);

            httpResponse = {
                mensagem: "Busca realizada com sucesso",
                obs: conteudoJson,
                status: 200
            }

            return res.status(httpResponse.status).json(httpResponse);
        });



    }
}
export class BuscaPadrao {
    public static async filtrarPadrao(req: Request, res: Response, entity: any): Promise<Response | void> {
        const where = req.query.where ? JSON.parse(decodeURIComponent(req.query.where as any)) : null;
        const whereLike = req.query.whereLike ? JSON.parse(decodeURIComponent(req.query.whereLike as any)) : null;
        const whereBetween = req.query.whereBetween ? JSON.parse(decodeURIComponent(req.query.whereBetween as any)) : null;
        const order = req.query.order ? JSON.parse(decodeURIComponent(req.query.order as any)) : null;
        const limit = req.query.limit ? parseInt(decodeURIComponent(req.query.limit as any)) : 500; // no máximo 500 registros
        const page = req.query.page ? parseInt(decodeURIComponent(req.query.page as any)) : 1;

        const attributes = req.query.attributes ? JSON.parse(decodeURIComponent(req.query.attributes as any)) : [];

        let httpResponse: RetornoHttp = new RetornoHttp();

        try {
            const sequelize = conexaoInterna;
            const queryInterface = sequelize.getQueryInterface();

            // Função para obter os nomes das colunas de uma tabela
            const getColumnNames = async (tableName: string, selectedAttributes: string[]): Promise<string[]> => {
                const columns = await sequelize.getQueryInterface().describeTable(tableName);
                return selectedAttributes.filter(attr => Object.keys(columns).includes(attr));
            };

            let selectColumns: string[] = [];

            // Colunas da tabela principal com atributos selecionados
            const mainTableName = entity.getTableName();
            const mainAttributes = await getColumnNames(mainTableName, attributes);
            const mainSelectColumns = mainAttributes.map(attr => `${mainTableName}.${attr} AS '${attr}'`);
            selectColumns.push(...mainSelectColumns);

            let baseQuery = `SELECT ${selectColumns.length ? selectColumns.join(', ') : '*'} FROM ${mainTableName} `;

            // Condições WHERE
            let whereClauseAdded = false;
            if (where) {
                baseQuery += `WHERE ${this.buildWhereCondition(where, sequelize, mainTableName)} `;
                whereClauseAdded = true;
            }

            // WHERE LIKE
            if (whereLike) {
                baseQuery += `${whereClauseAdded ? 'AND' : 'WHERE'} ${this.buildWhereLikeQuery(whereLike, sequelize, mainTableName)} `;
                whereClauseAdded = true;
            }

            // WHERE BETWEEN
            if (whereBetween) {
                baseQuery += `${whereClauseAdded ? 'AND' : 'WHERE'} ${this.buildWhereBetweenQuery(whereBetween, sequelize, mainTableName)} `;
                whereClauseAdded = true;
            }

            // Adiciona a cláusula ORDER BY
            if (order) {
                const orderClause = order.map(([column, direction]: [string, 'ASC' | 'DESC']) => {
                    return `${queryInterface.quoteIdentifier(column)} ${direction}`;
                }).join(', ');
                baseQuery += `ORDER BY ${orderClause} `;
            }

            // Limite e Paginação
            baseQuery += `LIMIT ${limit} OFFSET ${(page - 1) * limit}`;

            console.log("SQL: " + baseQuery);

            // Executa a consulta SQL bruta com a opção 'nest' para aninhar os resultados
            const result = await sequelize.query(baseQuery, {
                type: QueryTypes.SELECT,
                nest: true
            });

            httpResponse = {
                mensagem: "Busca realizada com sucesso",
                obs: {
                    totalCount: result.length,
                    data: result
                },
                status: 200
            };
        } catch (e) {
            console.error(e);
            httpResponse = {
                mensagem: "Erro interno",
                obs: null,
                status: 500
            };
        } finally {
            return res.status(httpResponse.status).json(httpResponse);
        }
    }

    // Helper para construir o WHERE condicional com escaping
    private static buildWhereCondition(where: any, sequelize: Sequelize, mainTableName: string): string {
        if (!where.operator || (where.operator != 'AND' && where.operator != 'OR')) {
            where.operator = 'AND'
        }

        const queryInterface = sequelize.getQueryInterface();
        return Object.keys(where.search)
            .map(key => {
                // Se a coluna já contém uma tabela (ex: 'clientes.id'), usa diretamente
                const [table, column] = key.includes('.') ? key.split('.') : [mainTableName, key];
                return `${queryInterface.quoteIdentifier(table)}.${queryInterface.quoteIdentifier(column)} = ${sequelize.escape(where.search[key])}`;
            })
            .join(` ${where.operator} `);
    }

    // Helper para construir o WHERE LIKE com escaping
    private static buildWhereLikeQuery(whereLike: any, sequelize: Sequelize, mainTableName: string): string {
        if (!whereLike) {
            return '';
        }

        if (!whereLike.operator || (whereLike.operator != 'AND' && whereLike.operator != 'OR')) {
            whereLike.operator = 'AND'
        }

        const queryInterface = sequelize.getQueryInterface();
        return Object.keys(whereLike.search)
            .map(key => {
                const [table, column] = key.includes('.') ? key.split('.') : [mainTableName, key];
                return `${queryInterface.quoteIdentifier(table)}.${queryInterface.quoteIdentifier(column)} LIKE ${sequelize.escape(`%${whereLike.search[key]}%`)}`;
            })
            .join(` ${whereLike.operator} `);
    }

    // Helper para construir o WHERE BETWEEN com escaping
    private static buildWhereBetweenQuery(whereBetween: any, sequelize: Sequelize, mainTableName: string): string {
        const queryInterface = sequelize.getQueryInterface();
        return Object.keys(whereBetween)
            .map(key => {
                const [table, column] = key.includes('.') ? key.split('.') : [mainTableName, key];
                const value = whereBetween[key];
                if (Array.isArray(value) && value.length === 2) {
                    return `${queryInterface.quoteIdentifier(table)}.${queryInterface.quoteIdentifier(column)} BETWEEN ${sequelize.escape(value[0])} AND ${sequelize.escape(value[1])}`;
                }
                return '';
            })
            .filter(condition => condition) // Remove condições vazias
            .join(' AND ');
    }
}



export class CriaPadrao {
    public static async criarPadrao(req: Request, res: Response, entity: any): Promise<Response> {
        let httpResponse: RetornoHttp = new RetornoHttp();
        try {
            const entidade = req.body;
            const entidadeCriada = await entity.create(entidade);

            httpResponse = {
                mensagem: "Cadastrado com sucesso!",
                obs: entidadeCriada,
                status: 200
            }
        } catch (err) {
            console.error(err);
            httpResponse = {
                mensagem: "Erro interno",
                obs: null,
                status: 500
            }
        } finally {
            return res.status(httpResponse.status).json(httpResponse);
        }
    }
}

export class AtualizaPadrao {
    public static async atualizarPadrao(req: Request, res: Response, entity: any): Promise<Response> {
        let httpResponse: RetornoHttp = new RetornoHttp();
        try {
            const { id } = req.params;
            const entidade = req.body;

            // nunca atualizar esses campos pelo usuário
            delete entidade.id;
            delete entidade.createdAt;
            delete entidade.updatedAt;

            await entity.update(entidade, { where: { id } });

            httpResponse = {
                mensagem: "Atualizado com sucesso!",
                obs: entity,
                status: 200
            }
        } catch (err) {
            console.error(err);
            httpResponse = {
                mensagem: "Erro interno",
                obs: null,
                status: 500
            }
        } finally {
            return res.status(httpResponse.status).json(httpResponse);
        }
    }
}

export class DeletaPadrao {
    public static async deletarPadrao(req: Request, res: Response, entity: any): Promise<Response> {
        let httpResponse: RetornoHttp = new RetornoHttp();
        try {
            const { id } = req.params;

            await entity.destroy({ where: { id } });

            httpResponse = {
                mensagem: "Deletado com sucesso!",
                obs: entity,
                status: 200
            }
        } catch (err) {
            console.error(err);
            httpResponse = {
                mensagem: "Erro interno",
                obs: null,
                status: 500
            }
        } finally {
            return res.status(httpResponse.status).json(httpResponse);
        }
    }
}

export class ValidarPadrao {
    public static async validar(req: Request, res: Response, next: NextFunction, entity: any, msg: string): Promise<Response | void> {
        let retorno: RetornoHttp = new RetornoHttp();

        try {

            // implementar

        } catch (error) {
            retorno = {
                mensagem: "Erro ao processar",
                obs: error.message,
                status: 400
            };
        }

        if (retorno.mensagem) {
            return res.status(retorno.status).json(retorno);
        } else {
            next();
        }
    }
}