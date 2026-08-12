const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const crypto = require('crypto')


const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

const user = {
  email: "harsh@gmail.com",
  pswrd: "1234",
};

let validRefreshTokenJti = null;
app.post("/login", (req, res) => {
  if (
    req.body.email &&
    req.body.pswrd &&
    req.body.email == user.email &&
    req.body.pswrd == user.pswrd
  ) {
    const payload = {
      email: user.email,
      role: "admin",
    };
    const accesToken = jwt.sign(payload, process.env.JWT_TOKEN, {
      expiresIn: "1m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_TOKEN, {
      expiresIn: "525960m",
      jwtid: crypto.randomUUID()
    });

    const decodedRefreshToken = jwt.decode(refreshToken);
    validRefreshTokenJti = decodedRefreshToken.jti;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });

    return res.status(200).json({
      message: "User logged in",
      token: accesToken,
    });
  } else {
    return res.status(400).json({
      message: "User not provided right credential",
    });
  }
});

app.post("/refresh", (req, res) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    if (!oldRefreshToken) {
      return res.status(401).json({
        message: "Refresh token not found",
      });
    }

    const decoded = jwt.verify(oldRefreshToken, process.env.JWT_TOKEN);
    if (decoded.jti !== validRefreshTokenJti) {
      return res.status(401).json({
        message: "Refresh token has already been used",
      });
    }
    validRefreshTokenJti = null;

    const payload = {
      email: decoded.email,
      role: decoded.role,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_TOKEN, {
      expiresIn: "1m",
    });

    const newRefreshToken = jwt.sign(payload, process.env.JWT_TOKEN, {
      expiresIn: "525960m",
      jwtid: crypto.randomUUID()
    });

    const newDecodedRefreshToken = jwt.decode(newRefreshToken);
    validRefreshTokenJti = newDecodedRefreshToken.jti;

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
    });

    return res.status(200).json({
      message: "Token updated",
      token: accessToken,
    });
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
});

function jwtMiddleware(req, res, next) {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      let decoded = jwt.verify(token, process.env.JWT_TOKEN);

      req.hrsh = decoded;
      next();
    } else {
      res.status(401).json({
        message: "header not there",
      });
    }
  } catch (err) {
    return res.status(401).json({
      message: "profile not authenticated ",
    });
  }
}

app.get("/profile", jwtMiddleware, (req, res) => {
  return res.status(200).json({
    message: "Profile access",
  });
});

app.listen(5000, () => {
  console.log("port started ");
});
