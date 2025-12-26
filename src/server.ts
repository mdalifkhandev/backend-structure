import mongoose from "mongoose";
import app from "./app";
import 'dotenv/config';

const port = process.env.PORT || 5001;

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URL as string);
        console.log('Connected to MongoDB');

        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Not connected to MongoDB', err);
    }
}

main();

