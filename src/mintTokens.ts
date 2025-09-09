import { getOrCreateAssociatedTokenAccount, mintTo , burn } from "@solana/spl-token";
import { Connection, Keypair, PublicKey, sendAndConfirmRawTransaction, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import { PRIVATE_KEY, PUBLIC_KEY, TOKEN_MINT_ADDRESS } from "./address.js";

const connection = new Connection("https://api.devnet.solana.com");


//THIS IS FOR MINTING NEW TOKENS TO SOMEONES ADDRESS
export const mintTokens = async (toAddress: string, amount: number) => {
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
        new PublicKey(toAddress)
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


// THIS IS FOR BURNING OUR OWN TOKENS
export const burnTokens = async (amount: number) => {
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
        payer.publicKey
    );

    if (!tokenAccount) {
        throw new Error("Token account not found");
    }

    const burnTxn = await burn(
        connection,
        payer,
        tokenAccount.address,
        mint,
        payer,
        amount
    );
    console.log("Burn Transaction: ", burnTxn);
    console.log("Burning tokens");
}

//THIS IS FOR SENDING SOME NATIVE TOKENS FROM OUR SIDE
export const sendNativeTokens = async ( toAddress: string, amount: number) => {

    const payer = Keypair.fromSecretKey(Uint8Array.from(PRIVATE_KEY));
    const transferTxn = SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: new PublicKey(toAddress),
        lamports: amount,
    });

    const txn = new Transaction().add(transferTxn);
    const signature = await sendAndConfirmTransaction(connection, txn, [payer]);

    console.log("Transfer signature:", signature);
    console.log("Sending native tokens");
}