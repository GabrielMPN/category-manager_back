import * as dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PW, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
    define: {
        timestamps: true,  // Ativa createdAt e updatedAt
    }
});

export default sequelize;