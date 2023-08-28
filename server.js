const app=require('express')();
const dotenv=require('dotenv');
const connectDB=require('./config/db');// DB connection
const UserRoute=require('./api/User');
dotenv.config();
const PORT = process.env.PORT || 3000;
connectDB();

const bodyParser=require('express').json;
app.use(bodyParser());
app.use('/user',UserRoute);
app.listen(PORT,()=>{
    console.log('server running');
})
