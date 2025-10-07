import dotenv from "dotenv";
dotenv.config();

export const mongoURI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_key";
