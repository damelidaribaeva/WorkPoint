import jwt from "jsonwebtoken";

// Coworking Authentication Middleware
const authCoworking = async (req, res, next) => {
  try {
    const { ctoken } = req.headers;
    if (!ctoken) {
      return res.json({
        success: false,
        message: "Not authorized login again",
      });
    }
    const token_decode = jwt.verify(ctoken, process.env.JWT_SECRET);
    req.cowId = token_decode.id;

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authCoworking;
