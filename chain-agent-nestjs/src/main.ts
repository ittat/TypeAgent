import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';


import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";
import { v4 as uuidv4 } from "uuid";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { createReactAgent } from "@langchain/langgraph/prebuilt";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
  await app.listen(process.env.PORT ?? 4399);

  // setTimeout(()=>{
  //   test();
  // },10000)
  
}
bootstrap();


async function  test(){

  try{
    console.log("sdfdsfdsfs",process.env.GOOGLE_API_KEY);
  
    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      modelName: 'gemini-2.0-flash',
      // maxOutputTokens: 2048,
      // temperature: 0.7,
      // topP: 0.8,
      // topK: 40,
      baseUrl: 'http://localhost:4399/gemini-proxy',
      // ...(process.env.ISDEV ? {
      //   endpoint: 'http://localhost:4399/gemini-proxy'
      // } : {})
    });

    // Define the function that calls the model
const callModel = async (state: typeof MessagesAnnotation.State) => {

  const promptTemplate = ChatPromptTemplate.fromMessages([
  
    ["system", "你是一个AI助手"],
    // ["human", "{question}"],
    ["placeholder", "{messages}"],


    //  下面的不可以
    // new SystemMessage("你是一个AI助手"),
    // new HumanMessage("{question}")
  ]);


  const prompt = await promptTemplate.invoke(state);
  const response = await model.invoke(prompt);
  return { messages: [response] };
};


// Define a new graph
// const workflow = new StateGraph(MessagesAnnotation)
//   // Define the node and edge
//   .addNode("model", callModel)
//   .addEdge(START, "model")
//   .addEdge("model", END);


  // Add memory
const memory = new MemorySaver();
// const app = workflow.compile({ checkpointer: memory });




const config = { configurable: { thread_id: uuidv4() } } as any;


    // const prompt = await generatePrompt("1+1=?");
    // const output = await app.invoke({ messages: [
    //   new HumanMessage("1+1=?")
    // ] },config);
  
    // const resp =  await model.invoke(prompt);
    // console.log(resp.content);
   
// Define the tools for the agent to use
const agentTools = [new TavilySearchResults({ maxResults: 3 })];

const agent = createReactAgent({
  llm: model,
  tools: agentTools,
  checkpointSaver: new MemorySaver(),
});
 const reps =  await agent.invoke({
  messages:[
    new HumanMessage("明天的北京天气怎么样？")
  ]
},config)

console.log(reps.messages);



  
    console.log("sdfdsf");
    // console.log(output.messages.find((m)=> {
    //   if(m instanceof AIMessage){
    //     return true;
    //   }
    // })?.content);
    
  }catch(e){
    console.log(e);
  }

  
}


async function generatePrompt (question:string){

  const promptTemplate = ChatPromptTemplate.fromMessages([
  
    ["system", "你是一个AI助手"],
    // ["human", "{question}"],
    ["placeholder", "{messages}"],


    //  下面的不可以
    // new SystemMessage("你是一个AI助手"),
    // new HumanMessage("{question}")
  ]);

  const prompt =  await promptTemplate.invoke({
    question
  })

  console.log(prompt.toChatMessages());
  

  return prompt

}