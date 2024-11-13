import { DataTypes, Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  // Criar a tabela 'categorias'
  await queryInterface.createTable('categorias', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    nivel: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: [1],
          msg: 'O nível deve ser maior ou igual a 1'
        },
        max: {
          args: [5],
          msg: 'O nível não pode ser maior que 5'
        }
      }
    },
    tipo: {
      type: DataTypes.ENUM('NIVEL', 'FILHA'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('ATIVO', 'INATIVO'),
      allowNull: false
    },
    idPai: {
      type: DataTypes.INTEGER,
      references: {
        model: 'categorias',
        key: 'id',
      },
      onDelete: 'CASCADE',
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    }
  });

  // Adicionar índices na tabela 'categorias'
  await queryInterface.addIndex('categorias', ['nivel']);
  await queryInterface.addIndex('categorias', ['status']);
  await queryInterface.addIndex('categorias', ['idPai']);

  // Criar a tabela 'categoriasFilhas'
  await queryInterface.createTable('categoriasFilhas', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('ATIVO', 'INATIVO'),
      allowNull: false
    },
    idCategoria: {
      type: DataTypes.INTEGER,
      references: {
        model: 'categorias',
        key: 'id'
      },
      onDelete: 'CASCADE',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    }
  });

  // Adicionar índices na tabela 'categoriasFilhas'
  await queryInterface.addIndex('categoriasFilhas', ['status']);
  await queryInterface.addIndex('categoriasFilhas', ['idCategoria']);
  await queryInterface.addIndex('categoriasFilhas', ['nome', 'idCategoria'], {
    unique: true
  });
}

async function down({ context: queryInterface }) {
  // Remover a tabela 'categoriasFilhas'
  await queryInterface.dropTable('categoriasFilhas');

  // Remover a tabela 'categorias'
  await queryInterface.dropTable('categorias');
}

module.exports = { up, down };
