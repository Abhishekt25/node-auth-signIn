import { Model,DataTypes } from "sequelize";
import sequelize from "../config/db";

class Users extends Model{
   public id!: number;
   public email!:string;
   public password!:string;

}

Users.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,  
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,

        },
    },
    {
        sequelize,
        tableName: 'users',
        timestamps: true, // Automatic handling of `createdAt` and `updatedAt`
    }
);


export default Users;