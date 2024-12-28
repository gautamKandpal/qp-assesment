import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: number;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      // Add the optional `user` property
      user?: UserPayload;
    }
  }
}

const verifyAdminToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.status(403).send("A token is required for authentication");
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      res.status(401).send("Invalid Token");
      return;
    }

    const user = decoded as UserPayload;
    if (user.role !== "ADMIN") {
      console.log("NOT AN ADMIN");
      res.status(403).send("Access denied");
      return;
    }

    req.user = user;
    if (user) {
      console.log("HAS ADMIN RIGHTS");
    }

    next();
  });
};

export default verifyAdminToken;
