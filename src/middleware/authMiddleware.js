import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import Faculty from "../models/Faculty.js";
import Admin from "../models/Admin.js";

// Middleware to protect routes
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role === "admin") {
        req.user = await Admin.findById(decoded.id).select("-password");
        req.user.role = "admin";
      } else if (decoded.role === "faculty") {
        req.user = await Faculty.findById(decoded.id).select("-password");
        req.user.role = "faculty";
      } else if (decoded.role === "student") {
        // ✅ Use JWT payload rollNo directly
        const student = await Student.findById(decoded.id).select("-password");
        if (!student) return res.status(401).json({ success: false, message: "Student not found" });

        req.user = {
          id: student._id,
          name: student.name,
          email: student.email,
          role: "student",
          rollNo: decoded.rollNo // ✅ preserve rollNo from token
        };
      }

      if (!req.user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ success: false, message: "Not authorized, no token" });
  }
};


export const protectFaculty = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach faculty only for faculty routes
      if (decoded.role === "faculty") {
        req.user = await Faculty.findById(decoded.id).select("-password");
        req.user.role = "faculty"; // ensure role is set
      } else {
        return res.status(403).json({ success: false, message: "Not authorized as faculty" });
      }

      if (!req.user) return res.status(401).json({ success: false, message: "Faculty not found" });
      next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
};

// Middleware for role-based access
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    next();
  };
};

// Explicit middleware for admin
export const admin = (req, res, next) => {
  if(req.user && req.user.role === 'admin'){
    next();
  } else {
    res.status(403).json({ success: false, message: "Not authorized as admin" });
  }
};

// Explicit middleware for faculty (this fixes your import issue)
export const verifyFaculty = (req, res, next) => {
  if(req.user && req.user.role === 'faculty'){
    next();
  } else {
    res.status(403).json({ success: false, message: "Not authorized as faculty" });
  }
};
