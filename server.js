const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDB = require("./config/connectDB");

dotenv.config();

connectDB();
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://walletwizard-be.onrender.com",
      "https://wallet-wizard-fe.vercel.app",
    ],
  })
);

//user route
app.use("/api/v1/users", require("./routes/userRoute"));

//Transaction Route
app.use("/api/v1/transactions", require("./routes/transactionRoutes"));

app.get("/", (req, res) => {
  res.send("Hellllooooo");
});
//port
const PORT = process.env.PORT || 8080;

//listen server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
