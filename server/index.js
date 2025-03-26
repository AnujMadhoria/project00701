import dotenv from "dotenv"
import killPort from 'kill-port';
import { app } from "./src/app.js"; 
import mongoose   from "mongoose";
dotenv.config({
    path: './src/.env'
})

;(async()=>{
    try {
        const db = await mongoose.connect('mongodb://localhost:27017/username');
        console.log("Mongo DB connected Successfully !!!");
     killPort(3000).then(() => {    
        app.listen(process.env.PORT || 3000, () => {
            console.log("Server is running at port : ${process.env.PORT}")
        })  
    });
    } catch (error) {
        console.log("mongodb connection error",error); 
    }  
})()                                       