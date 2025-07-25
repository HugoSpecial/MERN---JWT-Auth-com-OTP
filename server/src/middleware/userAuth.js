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

// export default userAuth;

// const userAuth = async (req, res, next) => {
//   try {
//     const { token } = req.cookies;

//     if (!token) {
//       return res.status(401).json({ 
//         success: false,
//         message: "Authorization token required" 
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     if (!decoded?.id) {
//       return res.status(401).json({ 
//         success: false,
//         message: "Invalid authentication token" 
//       });
//     }

//     // Attach user ID to request object for downstream use
//     req.userId = decoded.id;
//     res.locals.userId = decoded.id;
    
//     next();
//   } catch (error) {
//     console.error("Authentication error:", error);
    
//     if (error instanceof jwt.JsonWebTokenError) {
//       return res.status(401).json({ 
//         success: false,
//         message: "Invalid or expired token" 
//       });
//     }
    
//     return res.status(500).json({ 
//       success: false,
//       message: "Internal server error" 
//     });
//   }
// };

export default userAuth;