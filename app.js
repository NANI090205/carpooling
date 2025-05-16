require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("Not Connected to MongoDB:", err));

const userRoutes = require("./routes/users");
const rideRoutes = require("./routes/rides");
const dashboardRoutes = require("./routes/dashboard");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/users", userRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use('/rides', require('./routes/rides'));
app.use('/users', require('./routes/users')); 
app.use('/dashboard', require('./routes/dashboard'));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/signup", (req, res) => res.sendFile(path.join(__dirname, "public", "signup.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")));
app.get("/ridepublish", (req, res) => res.sendFile(path.join(__dirname, "public", "ridepublish.html")));
app.get("/dashboard", (req, res) => res.sendFile(path.join(__dirname, "public", "dashboard.html")));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
