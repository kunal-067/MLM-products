import mongoose from "mongoose";

// const dbUrl = process.env.DB_URI || 'mongodb://127.0.0.1:27017/mlm-prod';
const dbUrl = process.env.DB_URI || 'mongodb+srv://trekomi:AkqEPipnajKeTrTC@cluster0.uy9ofus.mongodb.net/richtrek-prod';


export async function connectDb() {
    try {
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            authSource: "admin",
        });
        console.log('Connected to database');
    } catch (error) {
        console.error('Error connecting to database:', error);
        // throw error;
    }
}
