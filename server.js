import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";


dotenv.config();


const app = express();


app.use(cors());

app.use(express.json());



const client = new OpenAI({

  apiKey: process.env.OPENAI_API_KEY

});





app.post("/api/ai", async (req,res)=>{


  try{


    const message = req.body.message;



    const response = await client.responses.create({

      model:"gpt-5-mini",

      input:

      `أنت مساعد دراسي ذكي اسمه Study Hub AI.
      أجب باللغة العربية بشكل واضح ومفيد للطلاب.

      سؤال الطالب:
      ${message}`

    });



    res.json({

      reply: response.output_text

    });



  }catch(error){


    console.log(error);


    res.status(500).json({

      reply:"حدث خطأ في الذكاء الاصطناعي"

    });


  }


});





app.listen(3001,()=>{

 console.log(
  "AI Server running on port 3001"
 );

});