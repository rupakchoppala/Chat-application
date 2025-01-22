 //import jwt from 'jsonwebtoken';
// export default middleware=(req,res,next)=>{
//     try{
//         const token=req.header.authorization.split(' ')[1];
//       const decodedtoken=jwt.verify(token,process.env.SECRET_KEY);
//       req.body.userId=decodedtoken.userId;
//       next();

//     }
//     catch(error){
//         res.status(401).send({
//             message:error.message,
//             status:false
//         });

//     }
// }

import jwt from 'jsonwebtoken';
const authMiiddleWare = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
    console.log('Received Token:', token);  // Log the token to check if it's received correctly

    if (!token) {
        console.log('No token found');  // Log if the token is missing
        return res.status(401).send({ message: 'Token missing. Unauthorized.', success: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Verify the token using your secret key
        console.log('Decoded Token:', decoded);  // Log the decoded token to check the payload

        req.body.userId = decoded.userId; // Attach userId from the decoded token to the request body
        next();
    } catch (error) {
        console.log('Token verification failed:', error.message); // Log any error during verification
        return res.status(401).send({ message: 'Invalid token', success: false });
    }
};

//export default authMiddleWare;
// import jwt from 'jsonwebtoken';

// const authMiddleware = (req, res, next) => {
//     try {
//         // Extract token from the Authorization header
//         const authHeader = req.headers.authorization;
//         if (!authHeader) {
//             console.log('Authorization header missing');
//             return res.status(401).json({ message: 'Authorization header missing. Unauthorized.', success: false });
//         }

//         const token = authHeader.split(' ')[1];
//          // Bearer <token>
//         if (!token) {
//             console.log('Token not found in Authorization header');
//             return res.status(401).json({ message: 'Token missing. Unauthorized.', success: false });
//         }

//         // Verify the token
//         const decoded = jwt.verify(token, process.env.SECRET_KEY);
//         console.log('Decoded Token:', decoded);

//         // Attach userId to the request object
//         req.body.userId = decoded.userId;
//         next();
//     } catch (error) {
//         console.error('Token verification failed:', error.message);

//         // Handle specific JWT errors if needed
//         if (error.name === 'TokenExpiredError') {
//             return res.status(401).json({ message: 'Token expired. Please log in again.', success: false });
//         }

//         if (error.name === 'JsonWebTokenError') {
//             return res.status(401).json({ message: 'Invalid token. Unauthorized.', success: false });
//         }

//         return res.status(500).json({ message: 'Internal server error during token verification.', success: false });
//     }
// };

 export default authMiiddleWare;
