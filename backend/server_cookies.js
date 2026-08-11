const express = require("express");
const app = express();
const cors = require("cors");

const crypto = require("crypto");

const cookieParser = require("cookie-parser");
const { measureMemory } = require("vm");
const user = {
  email: "harsh@gmail.com",
  password: "1234",
};

let session = {};

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true

  })
);

app.use(express.json());

app.post("/login", (req, res) => {
  if (user.email === req.body.email && user.password === req.body.password) {
    const sessionId = crypto.randomBytes(3).toString();
    const validSession = Date.now() + 5 * 60 * 1000;
    session[sessionId] = {
      user,
      expiresAt: validSession,
      role:'admin'
    };

    res.cookie("token", sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    return res.json({
      message: "LOgin succesfull",
    });
  }
  res.status(400).json({
    message: "email or password mismatch ",
  });
});

app.get("/profile", (req, res) => {
  if (req.cookies.token) {
    if (session[req.cookies.token] && Date.now() < session[req.cookies.token].expiresAt) {
      res.status(200).json({
        message: "Profile authenticated",
      });
    } else {
      res.status(400).json({
        message: "Not authenticated ",
      });
    }
  } else {
    res.clearCookie('token') 
    delete session[req.cookies.token]


    return res.status(400).json({
      message: "User not autheticated ",
    });
  }
  console.log(req.cookies);
});

app.post("/logout", (req, res) => {
  console.log(session, "session---------");
  const sessionId = req.cookies.token;
  const validate = sessionId in session;
  if (validate) {
    delete session[sessionId];
    res.clearCookie("token");
    return res.status(200).json({
      message: "Logout succesfully",
    });
  }
});

app.get('/admin',(req,res)=>{
  if(req.cookies.token){
    if(session[req.cookies.token].role === 'admin'){
      return res.status(200).json({
        message: 'admin access'
      })
    }
    else{
      return res.status(200).json({message: 'Not authorised to be admin'})
    }
  }else{
    return res.status(200).json({
      message:'invalid token'
    })
  }
})
app.listen(5000, () => {
  console.log("port started on localhost 500");
});
