import mongoose from "mongoose";
const connectDb=async()=>{
    try{
         
        await mongoose.connect(process.env.Db_url,{
                dbName:"chatBotai",
        });
        console.log("mongoDb connected");
    }catch(error){
        console.log(error);
    }
};
export default connectDb;