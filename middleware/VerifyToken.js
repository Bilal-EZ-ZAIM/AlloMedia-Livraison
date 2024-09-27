const jwt = require("jsonwebtoken");
const UserModel = require("../model/UserModel");
const ApiError = require("../util/ApiError");

const verifyToken = async (req, res, next) => {
  // 1 check Token
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new ApiError(
          "You are not login , Please login to get access this route",
          401
        )
      );
    }

    // console.log(decodeToken);

    // 2 virefiy Token

    // invalid signature
    const decodeToken = jwt.verify(token, process.env.JWT_SCREPT_KEY);

    if (!decodeToken) {
      throw "You are not login , Please login to get access this route";
    }

    const currentUser = await UserModel.findById(decodeToken.id).select(['passwordChangedAt' , 'role' , 'name' , 'email']);

    if (!currentUser) {
      return next(
        new ApiError("The user belonging to this token no longer exists.", 401)
      );
    }

    if (currentUser.passwordChangedAt) {
      const passwordChangedTimestamp = parseInt(
        currentUser.passwordChangedAt.getTime() / 1000,
        10
      );

      if (passwordChangedTimestamp > decodeToken.iat) {
        return next(
          new ApiError(
            "User recently changed his password please login again..",
            401
          )
        );
      }
    }

    req.user = currentUser;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(
        new ApiError("Your token has expired. Please log in again.", 401)
      );
    }
    if (error.name === "JsonWebTokenError") {
      return next(new ApiError("Invalid token. Please log in again.", 401));
    }
    return res.status(500).json({ error });
  }
};

module.exports = verifyToken;
