import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration,OpenAIApi } from 'openai';

    // To Use .env Variables
dotenv.config();

console.log(process.env.OPENAI_API_KEY)

   // new configration is a function which accepts object
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,

});

    // Instance Of OpenAI
const openai = new OpenAIApi(configuration);

    // Initilize express application
    // Cors allows our server to be called from Front-End
    // Pass JSON from front end to backend
const app = express();
app.use(cors());
app.use(express.json());

    //To Create Dummy Route Rout 
    // From Get Route We Can receive Data From FrontEnd
app.get('/' , async (req,res) => {
    res.status(200).send({
        message: 'Hello From Cipher',

    })
});

    // Post Allows Us To Have Body/Payload
    // Prompt Passed From Front-End
    // Temperature is amount of  risk
    // Max Tokens allows us to get Long/Short Responces
    // Frequency Penlaity helps us to control similar responces frequency 
app.post('/', async (req,res) => {
    try {
       const prompt =req.body.prompt;

       const response =await openai.createCompletion({
        model:"text-davinci-003",
        prompt: `${prompt}`,
        temperature:0,
        max_tokens:3000,
        top_p:1,
        frequency_penalty:0.5,
        presence_penalty:0,

       });

       // Send Data To Front-End
       res.status(200).send({
        bot: response.data.choices[0].text
       })
    } catch (error) {
        console.log(error);
        res.status(500).send ({error})
        
    }
})

  // Server Listening 
app.listen(5000,() => console.log(' Server is running on port http://localhost:5000'));

