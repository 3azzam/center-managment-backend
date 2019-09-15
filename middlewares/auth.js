const jwt = require("jsonwebtoken");

function auth(req, res, next) {

    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send(" please provide a token ");

    try {
        const decoded = jwt.verify(token, 'centerMannagementSecretKey');
        if (!decoded) req.status(403).send("access denied");
        req.user = decoded ; 
        next();
    }
    catch (err) {
        res.status(400).send("invaild token");
    }
}

module.exports = auth; 