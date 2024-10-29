import express,{Express,Request,Response} from "express";

const app:Express = express();

app.get("/",(req:Request,res:Response)=>{
    res.send("App is working!")
})

app.listen(8000,()=>{
    console.log(`Server is running on port 8000`);
})