import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI não está definido no .env");
    }

    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB ligado com sucesso");
    });

    await mongoose.connect(process.env.MONGODB_URI);

  } catch (error) {
    console.error(`❌ Erro ao ligar ao MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
