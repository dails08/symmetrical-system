import { initializeApp, cert } from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";
// import { Database, getDatabase, get, set, ref, child, DatabaseReference } from "firebase/database";
import { readFileSync } from "fs";


// const serviceAccount = JSON.parse(readFileSync("creds/slayers-74330-firebase-adminsdk-fbsvc-2e2d26caa1.json", "utf-8"));
// console.log(cert(serviceAccount));
// console.log(process.env.FIREBASE_CREDENTIALS);
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

const rtdbApp = initializeApp({
    credential: cert(serviceAccount),
})


export const db = getFirestore(rtdbApp, "slayersapp")

db.collection("campaigns").count().get().then((value) => {
    console.log("Slayers campaigns count: " + value.data().count);
})
