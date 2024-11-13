import { DataTypes, Model } from 'sequelize';
import db from '../conexaoInterna';

class CategoriaFilha extends Model {
  id: number;
  nome: string;
  status: 'ATIVO' | 'INATIVO';
  idCategoria: number;
 }

CategoriaFilha.init({
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
    }
  }
}, {
  sequelize: db,
  tableName: "categoriasFilhas",
  indexes: [
    { fields: ['status'] },
    { fields: ['idCategoria'] },
    {
      unique: true,
      fields: ['nome', 'idCategoria']
    }
  ]
});

export { CategoriaFilha };
