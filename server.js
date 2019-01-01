const express = require("express");
require("dotenv").config();
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");
const checkScope = require("express-jwt-authz");

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

function checkRole(role) {
    return function(req, res, next) {
        const assignedRoles = req.user['http://localhost:3000/roles'];
        
        if (Array.isArray(assignedRoles) && assignedRoles.includes(role)) {
            return next();
        } else {
            return res.status(401).send('Insufficient role')
        }
    }
}

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
app.get("/courses", jwtCheck, checkScope(["read:courses"]), (req, res) => {
  res.json({
    courses: [
      { id: 1, title: "Bulding Apps with React" },
      { id: 2, title: "Bulding Apps with Angular" }
    ]
  });
});

app.get("/admin", jwtCheck, checkRole('admin'), (req, res) => {
    res.json({
      message: "Private API"
    });
  });

app.listen(3001, () =>
  console.log(`Server run on ${process.env.REACT_APP_API_UR}`)
);
