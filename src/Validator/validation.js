const mongoose = require('mongoose')
const isValidfname = function (fname) {
    const fnameRegex = /^[A-Z][a-z]+$/;
    return fnameRegex.test(fname)
};
const isValidlname = function (lname) {
    const lnameRegex = /^[A-Z][a-z]+$/;
    return lnameRegex.test(lname)
};


const isValidEmail = function (email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ ;
    return emailRegex.test(email)
}


const isValidPassword = function(password) {
    const passwordRegex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    return passwordRegex.test(password)
};

const isValid = function(value) {
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value == 'string' && value.trim().length === 0) return false
    return true
}

const isValidObjectId = function(ObjectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

module.exports = { isValid, isValidEmail, isValidlname, isValidfname, isValidPassword, isValidObjectId }
    



