const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const cors = require("cors");
const path = require("path");


mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("DB connection successful");
    })
    .catch((err)=>{ 
        console.log(err);
    })


app.use(express.json());
app.use(cors());
// To make the images folder public
app.use("/images", express.static(path.join(__dirname, "/images")));


const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
	  cb(null, "images");
	},
	filename: (req, _file, cb) => {
		cb(null, req.body.name)
		// When using postman for testing, you the code below, since we can't use both formdata and raw
		// cb(null, "img.jpeg");
	},
  });
  
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (_req, res) => {
	res.status(200).json("File has been uploaded");
});


app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

app.use("/", (req, res, next) => {
	res.json({ 
	  msg: "Welcome, API endpoints are ready",
	});
	next();
  });


app.listen(process.env.PORT, ()=>{
	console.log(`Listening on port ${process.env.PORT}`)
})