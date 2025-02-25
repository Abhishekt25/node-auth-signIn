import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import sequelize from './config/db';
import cors from "cors";


const app = express();

//set up ejs
// app.set('view engine', 'ejs');
// app.set('views', 'src/views');

app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies


// Allow frontend to access API
app.use(cors({
  origin: "http://localhost:5173", 
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

//Routes
app.use('/api', authRoutes);


app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is connected to React!" });
});

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());




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