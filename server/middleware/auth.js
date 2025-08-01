import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(" ")[1];
  if (!token) return res.status(401).send('Access Denied');
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch {
    res.status(400).send('Invalid Token');
  }
};

export default authMiddleware;
