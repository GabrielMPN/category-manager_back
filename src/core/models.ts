import dbInterno from '../entidades/conexaoInterna';
import { Umzug, SequelizeStorage } from "umzug";
import { Sequelize } from "sequelize";
import { Categoria } from '../entidades/categorias/Categoria';
import { CategoriaFilha } from '../entidades/categoriasFilhas/CategoriaFilha';

// Função para executar as migrations
async function migrationsUp(sequelizeInstance: Sequelize) {
    const umzug = new Umzug({
        migrations: { glob: `migrations/*` }, // Ajuste o caminho para as migrations
        storage: new SequelizeStorage({ sequelize: sequelizeInstance }),
        context: sequelizeInstance.getQueryInterface(),
        logger: console,
    });

    await umzug.up(); // Executa as migrations
}

async function migrationsDown(sequelizeInstance: Sequelize) {
    const umzug = new Umzug({
        migrations: { glob: `migrations/*` }, // Ajuste o caminho para as migrations
        storage: new SequelizeStorage({ sequelize: sequelizeInstance }),
        context: sequelizeInstance.getQueryInterface(),
        logger: console,
    });

    await umzug.down(); // Executa as migrations
}

//instanciando para salvar na memória conseguindo sincronizar as tabelas (interno)
new Categoria;
new CategoriaFilha;

// Função para sincronizar o banco
export async function sincronizar() {
    try {
        console.log("⏳ Executando migrations para o DB geral...");
        await migrationsUp(dbInterno);
        console.log("🟢 Migrations DB geral executado com sucesso!");

    } catch (err) {
        console.log("Erro ao sincronizar modelos");
        console.log(err);
    }
}

export async function down() {
    try {
        console.log(`⏳ Executando down migration...`);

        await migrationsDown(dbInterno)
        console.log(`🟢 Down migration executado com sucesso!`);

    } catch (err) {
        console.log(`🔴 Erro ao executar migration down`);
        console.log(err);
    }
}

