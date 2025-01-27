import { Sequelize } from "sequelize";
import * as dotenv  from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASS as string,
    {
        host: 'localhost', // Hostname
        dialect: 'mysql',  // Database dialect
        logging: false,    // Disable query logging
    }
);

sequelize.authenticate()
.then(()=>{
    //console.log("Connection has been established successfully");
})
.catch((error)=>{
    console.error("Unable to connect to the database:", error);
})


export default sequelize;