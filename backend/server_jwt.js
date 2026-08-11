const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

const user = {
  email: "harsh@gmail.com",
  pswrd: "1234",
};

app.post("/login", (req, res) => {
  if (req.body.email && req.body.pswrd && req.body.email == user.email && req.body.pswrd == user.pswrd ) {

    const payload = {
      email: user.email,
      role: 'admin',
    };
    const jwt_signed_token = jwt.sign(payload,  process.env.JWT_TOKEN);

    return res.status(200).json({
      message: "User logged in",
      token: jwt_signed_token,
    });
  }else{
    return res.status(400).json({
        message:'User not provided right credential'
    })
  }
});


app.get('/profile', (req,res)=>{
    const token = req.headers.authorization.split(' ')[1]
    if(jwt.verify(token, process.env.JWT_TOKEN)){ 
        return res.status(200).json({
            message:'Profile access'
        })
    }else{
        res.status(404).json({
            message:'Not verified '
        })
    }
})

app.listen(5000, () => {
  console.log("port started ");
});
