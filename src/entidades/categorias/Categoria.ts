import { DataTypes, Model, Optional } from 'sequelize';
import db from '../conexaoInterna';
import { CategoriaFilha } from '../categoriasFilhas/CategoriaFilha';

// Atributos da Categoria
interface ICategoriaAttributes {
  id: number;
  nome: string;
  nivel: number;
  status: 'ATIVO' | 'INATIVO';
  idPai: number | null;
}

// Atributos criáveis da Categoria (sem o 'id' porque ele é gerado automaticamente)
interface ICategoriaCreationAttributes extends Optional<ICategoriaAttributes, 'id'> {}

// Classe Categoria com tipagem explícita
class Categoria extends Model<ICategoriaAttributes, ICategoriaCreationAttributes> implements ICategoriaAttributes {
  public id!: number; // O TypeScript agora sabe que `id` é obrigatório
  public nome!: string;
  public nivel!: number;
  public status!: 'ATIVO' | 'INATIVO';
  public idPai!: number | null;
}

// Inicialização do modelo com a tipagem
Categoria.init({
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
    allowNull: false,
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
  }
}, {
  sequelize: db,
  tableName: "categorias",
  indexes: [
    { fields: ['nivel'] },
    { fields: ['status'] },
    { fields: ['idPai'] },
    { fields: ['nome', 'idPai'], unique: true }
  ]
});

export { Categoria };
