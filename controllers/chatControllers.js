import "dotenv/config";
import { Chat} from "../models/Chat.js";
import { Conversation} from "../models/Conversation.js";
import { GoogleGenAI } from "@google/genai";

// console.log("GEMINI KEY IN CONTROLLER:", process.env.GEMINI_API_KEY);

export const createChat=async(req,res)=>{
    try{
        const userId=req.user._id
        const chat= await Chat.create({
            user:userId,
        });
        res.json(chat);
    }catch(error){
        res.status(500).json({
            message:error.message,
        });
    }
};
 export const getAllChats=async(req,res)=>{
    try{
        const chats=await Chat.find({user:req.user._id}).sort({
            createdAt:-1,
        });
        res.json(chats);
    }
    catch(error){
res.status(500).json({
    message:error.message,
});
    }
 };

 export const addConversation=async(req,res)=>{
    try{
const chat=await Chat.findById(req.params.id)
if(!chat) return res.status(404).json({
    message:"No Chat with this id",
});
const conversation=await Conversation.create({
    chat:chat._id,
    question:req.body.question,
    answer:req.body.answer,
});
const updatedChat=await Chat.findByIdAndUpdate(
    req.params.id,
    {latestMessage:req.body.question},
    {new:true}
);
res.json({
    conversation,updatedChat,
});
    }catch(error){
res.status(500).json({
    message:error.message,
});
    }
 };

 export const getConversation=async(req,res)=>{
    try{
        const conversation=await Conversation.find({
            chat:req.params.id
        });
        if(!conversation) return res.status(404).json({
    message:"No conversation with this id",
});
        res.json(conversation)
    } catch(error){
        res.status(500).json({
            message:error.message,
        });
    }
 };

 export const DeleteChat=async(req,res)=>{
    try{
        const chat=await Chat.findById(req.params.id);
        if(!chat)
            return res.status(404).json({
        message:"No chat with this id",
        });
        if(chat.user.toString()!==req.user._id.toString()) 
            return res.status(403).json({
            message:"Unauthorised",
        });
        await chat.deleteOne()
        res.json({
            message:"chat Deleted",
        })
    }
    catch(error){
        res.status(500).json({
            message:error.message,
        });
    }
 };

 console.log("API KEY EXISTS:", !!process.env.GEMINI_API_KEY);
const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const chatWithGemini = async (req, res) => {
  try {
    const { message } = req.body;

    const response = await client.models.generateContent({
      model: "gemini-flash-latest",
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    });
    // console.log("RAW GEMINI RESPONSE:", JSON.stringify(response, null, 2));
    const reply =
      response.candidates[0].content.parts[0].text
 ||
      "No response from Gemini";
// console.log("FINAL REPLY SENT:", reply);
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Gemini error FULL:", error);
    res.status(500).json({
      error: error.message || "Gemini SDK error",
    });
  }
};
