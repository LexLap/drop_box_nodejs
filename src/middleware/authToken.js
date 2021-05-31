const User = require("../models/userModel");

const tokenToID = async (req, res, next) =>{

    const user = await User.findByToken(req.query.token)
    req.query.id = user._id
    next()
}

module.exports = {
    tokenToID
} 