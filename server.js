const express = require("express");
require("dotenv").config();
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");

const app = express();

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${
      process.env.REACT_APP_AUTH0_DOMAIN
    }/.well-known/jwks.json`
  }),
  audience: "http://localhost:3001",
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
  algorithms: ["RS256"]
});

app.get("/public", (req, res) => {
  res.json({
    message: "Public API"
  });
});
app.get("/private", jwtCheck, (req, res) => {
  res.json({
    message: "Private API"
  });
});

app.listen(3001, () =>
  console.log(`Server run on ${process.env.REACT_APP_API_UR}`)
);
