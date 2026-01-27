
import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.route.js";
import connectDB from "./config/database.js";



const app = express();
const PORT = 3000;


connectDB();
app.use(cors({
    origin: "http://localhost:5173", 
  }));
app.use(express.json());



app.get('/', (req, res) => {
  res.send('hello');
});
app.use("/api", chatRoutes);


app.listen((PORT?PORT:3000), () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


