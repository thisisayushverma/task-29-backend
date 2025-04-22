import express from "express";
import fs from "node:fs/promises"
import { createReadStream } from "node:fs";
import cors from "cors"
import path from "node:path";

const _dirname = path.resolve();
console.log(_dirname);

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(_dirname ,'/public')));
app.use(cors());


const reqLogger = (req,res,next)=>{
    console.log("req:-",req.url);
    next();
}

app.get("/",async (req,res)=>{
    await fs.readdir("./public")
    .then((files)=>{
        res.status(200).json({
            message:"success",
            data:files.filter((file)=>file !== "favicon.ico")
        });
    })
    .catch((err)=>{
        res.status(501).json({
            message:"server error",
            error:err
        })
    })

})

app.get('/:id',reqLogger,async (req,res)=>{
    const id = req.params.id;
    const readStream = createReadStream(`./public/${id}`);
    res.writeHead(200,{'Content-Type':'video/mp4'});
    readStream.pipe(res);
    // console.log(readStream.pipe());
})





app.listen(4000,()=>{
    console.log("server is running on port 4000");
})