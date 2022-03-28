const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());

const productsRouter = require('./routes/products');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const usersRouter = require('./routes/user');
const categoryRouter = require('./routes/category');
const ordersRouter = require('./routes/orders');


require('express-async-errors');
require('dotenv').config();
app.use(express.json());
app.use('/products',productsRouter);
app.use('/register',registerRouter);
app.use('/login',loginRouter);
app.use('/users',usersRouter);
app.use('/category',categoryRouter);
app.use('/orders',ordersRouter);

app.use((err,req,res,next)=>{
    res.status(err.status || 500).send({
        message: err.message,
        code: err.code
      });
})
    


mongoose.connect('mongodb://localhost:27017/Mean_project')
.then(()=>console.log('connected to mongo'))
.catch(()=>console.error('failed to connect'));  

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log("connected successfully on port "+port);

})