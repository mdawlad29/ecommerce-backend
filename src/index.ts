import express,{Express,Request,Response} from 'express';
const app:Express=express()

app.use(express.json())

app.use("/",(req:Request,res:Response)=>{
    res.send("Working")
})

app.listen(8000,()=>{
    console.log(`Server is running on port ${8000}`)
})