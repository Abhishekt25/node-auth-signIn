import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import sequelize from './config/db';


const app = express();

//set up ejs
app.set('view engine', 'ejs');
app.set('views', 'src/views');

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


//Routes
app.use(authRoutes);

// Start server
const startServer = async () => {
    try {
      await sequelize.authenticate();
      // console.log('Database connected');
      app.listen(2507, () => {
        console.log('Server running on http://localhost:2507');
      });
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  };

startServer();