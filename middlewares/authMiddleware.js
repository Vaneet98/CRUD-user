const jwt = require("jsonwebtoken");

const Service = require("../service");

var checkUserAuth = async (req, res, next) => {
  let token;
  //Get token form header
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      //splite the Bearer and token because for verification
      token = authorization.split(" ")[1];
 
      //Verify token
      const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
      //get user from token
      req.datas = await Service.userService.getdata(userId);
      next();
    } catch (error) {
      res.status(402).send({ status: "failed", message: "Unauthrozied user" });
    }
  }
  if (!token) {
    res
      .status(401)
      .send({ status: "failed", message: "Unauthorized User,No token" });
  }
};

module.exports = checkUserAuth;
