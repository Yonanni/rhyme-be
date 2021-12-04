import jwt from 'jsonwebtoken'


const verifyToken = (req, res, next) => {
    let token = req.headers["authorization"];
  
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      req.userId = decoded.id;
      next();
    });
};

const authJwt = {
    verifyToken
  };
export default authJwt;