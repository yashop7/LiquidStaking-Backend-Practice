require("dotenv").config();
import express from "express";
import { burnTokens, mintTokens, sendNativeTokens } from "./mintTokens";

const app = express();

//Trimmed Down version of Response from Helius Webhook
// This is just for testing purpose
const HELIUS_RESPONSE = {
  nativeTransfers: [
    {
      amount: 1000000000,
      fromUserAccount: "2hM8rU9Cu7g3cSfC7C76t41sMcceWUgnxCgmjznMnwJc",
      toUserAccount: "2hM8rU9Cu7g3cSfC7C76t41sMcceWUgnxCgmjznMnwJc",
    },
  ],
};

// This is the vault address where the SOL will be sent
const VAULT = "2hM8rU9Cu7g3cSfC7C76t41sMcceWUgnxCgmjznMnwJc";

app.get("/helius", async (req, res) => {
  const incomingTxn = HELIUS_RESPONSE.nativeTransfers.find(
    (x) => x.toUserAccount === VAULT
  );
  if (!incomingTxn) {
    res.json({ message: "message processed" });
    return;
  }
  const fromAddress = incomingTxn.fromUserAccount;
  const toAddress = VAULT;
  const amount = incomingTxn.amount;
  const type = "received_native_sol";
  try {
    // Now we need to mint tokens to these Address
    // await mintTokens(toAddress, amount);
    // Burning Tokens from out Address
    // await burnTokens(amount);
    //sending someone Native Token
    await sendNativeTokens( toAddress, amount);
    
    // if (type === "received_native_sol") {
    //     await mintTokens(fromAddress, toAddress, amount);
    // } else {
    //     // What could go wrong here?
    //     await burnTokens(fromAddress, toAddress, amount);
    //     await sendNativeTokens(fromAddress, toAddress, amount);
    // }

    res.send("Transaction successful");
  } catch (err) {
    console.error("Error processing transaction:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// THIS IS THE Response FROM HELIUS API

// {
//   "accountData": [
//     {
//       "account": "2hM8rU9Cu7g3cSfC7C76t41sMcceWUgnxCgmjznMnwJc",
//       "nativeBalanceChange": -1000080000,
//       "tokenBalanceChanges": []
//     },
//     {
//       "account": "RStK1PmXx5eC8GUceGe1iZeauzmr1yjggseWcP18cFE",
//       "nativeBalanceChange": 1000000000,
//       "tokenBalanceChanges": []
//     },
//     {
//       "account": "11111111111111111111111111111111",
//       "nativeBalanceChange": 0,
//       "tokenBalanceChanges": []
//     },
//     {
//       "account": "ComputeBudget111111111111111111111111111111",
//       "nativeBalanceChange": 0,
//       "tokenBalanceChanges": []
//     }
//   ],
//   "description": "2hM8rU9Cu7g3cSfC7C76t41sMcceWUgnxCgmjznMnwJc transferred 1 SOL to RStK1PmXx5eC8GUceGe1iZeauzmr1yjggseWcP18cFE.",
//   "events": [],
//   "fee": 80000,
//   "feePayer": "2hM8rU9Cu7g3cSfC7C76t41sMcceWUgnxCgmjznMnwJc",
//   "instructions": [
//     {
//       "accounts": [],
//       "data": "3b1H8Rq1T3d1",
//       "innerInstructions": [],
//       "programId": "ComputeBudget111111111111111111111111111111"
//     },
//     {
//       "accounts": [],
//       "data": "LKoyXd",
//       "innerInstructions": [],
//       "programId": "ComputeBudget111111111111111111111111111111"
//     },
//     {
//       "accounts": [
//         "2hM8rU9Cu7g3cSfC7C76t41sMcceWUgnxCgmjznMnwJc",
//         "RStK1PmXx5eC8GUceGe1iZeauzmr1yjggseWcP18cFE"
//       ],
//       "data": "3Bxs3zzLZLuLQEYX",
//       "innerInstructions": [],
//       "programId": "11111111111111111111111111111111"
//     }
//   ],
//   "nativeTransfers": [
//     {
//       "amount": 1000000000,
//       "fromUserAccount": "2hM8rU9Cu7g3cSfC7C76t41sMcceWUgnxCgmjznMnwJc",
//       "toUserAccount": "RStK1PmXx5eC8GUceGe1iZeauzmr1yjggseWcP18cFE"
//     }
//   ],
//   "signature": "2vH2dyFzeh5NitMC19hoUb4FfTLPdEtUpz45qW9RYuET1sUYkeLMhAqmuCMSPEBf6mCm4DUiS79kn8CQCoqa7FYC",
//   "slot": 406694201,
//   "source": "SYSTEM_PROGRAM",
//   "timestamp": 1757425150,
//   "tokenTransfers": [],
//   "transactionError": null,
//   "type": "TRANSFER"
// }
