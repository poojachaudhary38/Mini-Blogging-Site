const jwt = require("jsonwebtoken");
let authorModel = require("../models/authorModel");
let authorController=require("../controller/authorController");
let blogController=require("../controller/blogController");

const authentication = function(req,res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) {
      return res.status(400).send({status: false, msg: "No token provided"});
    }
    let decodeToken = jwt.verify(token, "group-4");
    if (!decodeToken) {
      return res.status(400).send({status: false, msg: "Invalid token"});
    }
    let authorId = req.query.authorId || req.body.authorId;
    if (!authorId) {
      return res.status(400).send({status: false, msg: "This authorId is not exist"});
    }
    if (!validator.isValidObjectId(authorId)) {
      return res.status(400).send({status: false, msg: "Invalid authorId"});
    }
    req.loggedIn = decodeToken.authorId;
    next();
  } catch (err) {
    return res.status(500).send({status: false, err: err.message});
  }
};

const authorization = function (req, res, next) {
  try{ 
    const authorId = req.query.authorId || req.body.authorId;
    if (req.loggedIn != authorId) {
      return res.status(400).send({status: false, msg: "Invalid user"});
    }
    next();
  } catch (err) {
    return res.status(500).send({status: false, err: err.message});
  }
};

module.exports.authentication = authentication
module.exports.authorization = authorization