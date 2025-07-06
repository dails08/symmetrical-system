import { initializeApp, cert } from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";
// import { Database, getDatabase, get, set, ref, child, DatabaseReference } from "firebase/database";
import { readFileSync } from "fs";


const serviceAccount = JSON.parse(readFileSync("creds/slayers-74330-firebase-adminsdk-fbsvc-2e2d26caa1.json", "utf-8"));
// console.log(cert(serviceAccount));

const rtdbApp = initializeApp({
    credential: cert(serviceAccount),
})


export const db = getFirestore(rtdbApp, "slayersapp")
