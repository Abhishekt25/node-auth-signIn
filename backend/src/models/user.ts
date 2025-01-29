import { Model,DataTypes } from "sequelize";
import sequelize from "../config/db";

class Users extends Model{
   public id!: number;
   public email!:string;
   public resetToken!:string;
   public password!:string;
   public resetTokenExpires!:string;

}

Users.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,  
        },
        fname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        resetToken:{
            type: DataTypes.STRING,
            allowNull:true,
            defaultValue: null
        },
        resetTokenExpires:{
            type: DataTypes.STRING,
            allowNull:true,
            defaultValue: null
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
        timestamps: true, 
    }
);


export default Users;