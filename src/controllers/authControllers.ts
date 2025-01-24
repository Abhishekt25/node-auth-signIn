import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Users from '../models/user';

const JWT_SECRET = 'your_jwt_secret'; 

// Register
export const register = async (req: any, res: any) => {
    const { email, password } = req.body;
    // console.log('Request Body:', req.body); // Add this line
  
    try {
      if (!email || !password) {
        return res.status(400).render('register', { message: 'Please provide both email and password.' });
      }
  
      const existingUser = await Users.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).render('register', { message: 'Email already exists.' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await Users.create({ email, password: hashedPassword });
  
      res.status(201).render('login', { message: 'Registered successfully. Please log in.' });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).render('register', { message: 'Server error. Please try again later.' });
    }
  };
    
  

// Login
export const login = async (req: any, res: any) => {
  const { email, password } = req.body;

  try {

    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(400).render('login', { message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).render('login', { message: 'Invalid credentials.' });
    }

 
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('auth_token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.redirect('/dashboard');
  } 
  catch (error) {
    console.error('Error during login:', error);
    res.status(500).render('login', { message: 'Server error. Please try again later.' });
  }
};

//Dashboard

export const dashboard = (req:any, res:any) =>{
  if(req.user){
    res.render('dashboard',{user:req.user});
  }
  else{
    res.redirect('/login');
  }
}

// logOut
 export const logOut = (req:any, res:any) =>{
  // clear the auth_token cookies
  res.clearCookie('auth_token',{
    httponly:true,
    secure:true,
    sameSite:"strict",
  });
  res.redirect("/login");
 }