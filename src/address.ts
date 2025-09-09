import dotenv from "dotenv";
dotenv.config();
export const PRIVATE_KEY = process.env.PRIVATE_ADDRESS ? JSON.parse(process.env.PRIVATE_ADDRESS) : [];
export const PUBLIC_KEY = process.env.PUBLIC_ADDRESS || "";
export const TOKEN_MINT_ADDRESS = process.env.TOKEN_MINT_ADDRESS || "";