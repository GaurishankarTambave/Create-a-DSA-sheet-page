import express, { Request } from 'express';
let router = express.Router();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { StatusCode } from '../../enum/statusCode';
import Database from '../../controller/database';
import { ObjectTypes } from '../../enum/ObjectTypes';
export default router

router.post('/student/login',async function (req: Request, res: any) {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(StatusCode.BadRequest).json({ message: 'Request body is empty', statusCode: StatusCode.BadRequest });
        }
        if (!req.body.username || !req.body.password) {
            return res.status(StatusCode.BadRequest).json({ message: 'Username or password is missing', statusCode: StatusCode.BadRequest });
        }
        const { username, password} = req.body;
        let studentQuery = await Database.querySytem({ objType: ObjectTypes.STUDENT, username: username });
        if (studentQuery.length === 0) {
            return res.status(StatusCode.BadRequest).json({ message: 'Invalid username or password', statusCode: StatusCode.BadRequest });
        }
        if (!studentQuery || !(await bcrypt.compare(password, studentQuery[0].password))) {
            return res.status(StatusCode.Unauthorized).send("Invalid username or password");
        }
        let secret = `${process.env.JWT_SECRET}`;
        const token = jwt.sign({ id: studentQuery._id , username: studentQuery.username}, secret, { expiresIn: '2h' });
        res.status(StatusCode.Created).json({ message: 'Student logged in successfully', data: {UserToken: token}, statusCode: StatusCode.Created });
    } catch (error) {
        return res.status(StatusCode.serverError).json({ message: 'Internal server error', statusCode: StatusCode.serverError });
    }
});
