const jwt = require("jsonwebtoken");

const JWT_SECRET = "secret_key"; // Secret key for JWT

// Function to generate a JWT for a user
function generateToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    {
      expiresIn: "1h", // Token expiration time
    }
  );
}

// Middleware to authenticate the JWT token
function authenticateToken(req, res, next) {  
  const { userId, adminId } = req.params;
  
  if (adminId || (userId && userId != ":userId")) {
    const token = req.cookies.jwt;

    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403); // Forbidden
      req.user = user; // Attach user information to the request
    });
  }
  next();
}

// Middleware to check if the userId in the request matches the authenticated user
const checkUserId = (req, res, next) => {  
  let { userId, adminId } = req.params;
  userId = userId || adminId;
  if (userId != ":userId") {
    if (!req.user || req.user.userId != userId || !['user', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }
  next();
};

// Middleware to check if the authenticated user is an admin
const checkAdmin = (req, res, next) => {  
  if (req.user.role != "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

module.exports = {
  authenticateToken,
  generateToken,
  checkUserId,
  checkAdmin,
};
