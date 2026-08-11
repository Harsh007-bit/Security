const express = require("express");
const app = express();
const cors = require("cors");

const crypto = require('crypto')


const cookieParser = require('cookie-parser')
const user = {
  email: "harsh@gmail.com",
  password: "1234",
};

let session = {}


app.use(cookieParser())

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.post("/login", (req, res) => {
  if (user.email === req.body.email && user.password === req.body.password) {
    const sessionId = crypto.randomBytes(3).toString()
    session[sessionId]= user

    res.cookie("token",sessionId );
    return res.json({
      message: "LOgin succesfull",
    });
  }
  res.status(400).json({
    message: "email or password mismatch ",
  });
});

app.get("/profile", (req, res) => {
  console.log(req, "req profile----------")
  console.log(session,"session------")


  if(req.cookies.token){
  if (session[req.cookies.token]) {
    res.status(200).json({
      message: "Profile authenticated",
    });
  } else {
    res.status(400).json({
      message: "Not authenticated ",
    });
  }}else{
    return res.status(400).json({
      message: "User not autheticated "
    })
  }
  console.log(req.cookies);

});

app.listen(5000, () => {
  console.log("port started on localhost 500");
});
