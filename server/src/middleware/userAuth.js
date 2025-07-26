import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;
  
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized access. No token provided." });
    }
  
    try {
      const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
  
      if (tokenDecode.id) {
        res.locals.userId = tokenDecode.id;
      } else {
        return res
          .status(401)
          .json({ message: "Unauthorized access. Login Again." });
      }
      next();
    } catch (error) {
      console.error("Error in userAuth middleware:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  };

export default userAuth;
