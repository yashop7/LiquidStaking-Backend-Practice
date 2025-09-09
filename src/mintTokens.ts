import { getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { PRIVATE_KEY, PUBLIC_KEY, TOKEN_MINT_ADDRESS } from "./address.js";

const connection = new Connection("https://api.devnet.solana.com");

export const mintTokens = async (fromAddress: string, amount: number) => {
    if (!TOKEN_MINT_ADDRESS) {
        throw new Error("TOKEN_MINT_ADDRESS is not defined");
    }
    const payer = Keypair.fromSecretKey(Uint8Array.from(PRIVATE_KEY));
    const mint = new PublicKey(TOKEN_MINT_ADDRESS);


    //We created the ATA of our Token for the other User
    // we could have also created the ATA of our Token from Terminal by spl-token create-account <TOKEN_MINT_ADDRESS>
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        new PublicKey(fromAddress)
    );


    const mintTxn = await mintTo(
        connection,
        payer,
        mint,
        tokenAccount.address,
        payer,
        amount
    );
    console.log("Mint Transaction: ", mintTxn);
    console.log("Minting tokens");
}

export const burnTokens = async (fromAddress: string, toAddress: string, amount: number) => {
    console.log("Burning tokens");
}

export const sendNativeTokens = async (fromAddress: string, toAddress: string, amount: number) => {
    console.log("Sending native tokens");
}