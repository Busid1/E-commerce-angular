import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://busid:edb1234@cluster0.85eam.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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