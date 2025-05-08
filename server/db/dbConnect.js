import mongoose from "mongoose";
import "dotenv/config";

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env'
    )
}

export default async function dbConnect() {
    mongoose
        .connect(MONGODB_URI)
        .then((x) => {
            const dbName = x.connections[0].name
            console.log(`Connected to Mongo! Database name: "${dbName}"`)
        })
        .catch((err) => {
            console.error("Error connecting to mongo: ", err)
        })
}