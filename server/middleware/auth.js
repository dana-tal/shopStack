
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// require the user to be logged in ... 
function requireAuth(req, res, next) 
{
  const token = req.cookies.token;
  if (!token) 
    return res.status(401).json({ message: "Not logged in" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach {id, role}
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// require the user to be an admin
function requireAdmin(req, res, next)
 {
  requireAuth(req, res, () => {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Admins only" });
    next();
  });
}

function verifyToken(req, res, next) {
 
  try {
    const token = req.cookies?.token; // httpOnly cookie
    if (!token) return res.status(401).json({ ok: false, message: "No token" });

    const decoded = jwt.verify(token, JWT_SECRET);
    // Optionally: check token expiry, user existence in DB, etc.
    req.user = decoded; // attach user data (what you signed)
    next();
  } 
  catch (err)
  {
      return res.status(401).json({ ok: false, message: "Invalid token" });
   }
}


module.exports = {
    requireAdmin,
    requireAuth,
    verifyToken
}
