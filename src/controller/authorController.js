const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");
const validator = require("../Validator/validation");

//________________CREATE AUTHOR_________________//

const createAuthor = async function (req,res) {
   try {
    const data = req.body;
     if (Object.keys(data).length == 0) {
        return res.status(400).send({status: false, msg: "Not entered field"});
     }

     const { fname, lname, title, email, password } = data;
     if (!fname) {
        return res.status(400).send({ status: false, msg: "Please enter fname"});
     }
     if (!lname) {
        return res.status(400).send({ status: false, msg: "Please enter lname"});
     }
     if (!title) {
        return res.status(400).send({ status: false, msg: "Please enter title"});
     } else {
        if (title != "Mr" && title != "Mrs" && title != "Miss") {
            return res.status(400).send({ status: false, msg: "Please enter the valid title"});
        }
     }
     if (!validator.isValidEmail(email)) {
        return res.status(400).send({ status: false, msg: "Please enter valid email address"});
     }

     const isEmailAlreadyUsed = await authorModel.findOne({ email });
     if (isEmailAlreadyUsed) {
        return res.status(400).send({ status: false, msg: "It is a used email"});
     }

     if (!validator.isValidPassword(password)) {
        return res.status(400).send({ status: false, msg: "Password is mandatory"});
     }

     const newAuthor = await authorModel.create(data);
     res.status(201).send({ status: true, msg: "Author is created"});
   } catch (err) {
    return res.status(500).send({ status: false, msg: err.message});
   }
};

//==============LOGIN USER=============
const login = async function (req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (!validator.isValidEmail(email)) {
            return res.status(400).send({ status: false, msg: "Email is mandatory"});
        }
        
        if (!validator.isValidPassword(password)) {
            return res.status(400).send({ status: false, msg: "Password is mandatory"});
        }

        const author = await authorModel.findOne({ email, password });
        if (!author) {
            return res.status(401).send({ status: false, msg: "Invalid User"});
        }
        const token = jwt.sign({ authorId: author._id.toString() }, "group-4");
        res.setHeader("x-api-key",token);
        return res.status(200).send({ status: true, msg: token });
    } catch (err) {
        return res.status(500).send({ status: false, err: err.message });
    }
};

module.exports.createAuthor = createAuthor
module.exports.login = login
