import express, { Request } from 'express';
import bcrypt from 'bcryptjs';
import config from '../../../config';
import Database from '../../controller/database';
import { ObjectTypes } from '../../enum/ObjectTypes';
import { StatusCode } from '../../enum/statusCode';
import Utils from '../../controller/utils';
let router = express.Router();
export default router;


router.post('/student/register',async function (req: Request, res: any) {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(StatusCode.BadRequest).json({ message: 'Request body is empty', statusCode: StatusCode.BadRequest });
    }
    const requiredFields: any = [];
    config.studentFields.forEach((key: any) => {
        !Object.keys(req.body).includes(key) ? requiredFields.push(key) : '';
    });
    if (requiredFields.length > 0) {
        return res.status(StatusCode.BadRequest).json({ message: `Required field(s) are missing: [${requiredFields.join(', ')}]`, missingFields: requiredFields, statusCode: StatusCode.BadRequest});
    }
    if (!Utils.getRegex('email').test(req.body.username) && (typeof req.body.username === 'string' && !(Utils.getRegex('phone').test(req.body.username)))) {
        return res.status(StatusCode.BadRequest).json({ message: `Username seems to be invalid based on format`, statusCode: StatusCode.BadRequest});
    } 
    const { username, password, firstName, lastName, gender, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const studentRecord = { username, password: hashedPassword, firstName, lastName, gender, phone , objType: ObjectTypes.STUDENT };
    let studentQuery = await Database.querySytem({ objType: ObjectTypes.STUDENT, username: username });
    if (studentQuery.length > 0) {
        return res.status(StatusCode.BadRequest).json({ message: 'Student with same username already exists', statusCode: StatusCode.BadRequest });
    }
    const userResult = await Database.saveSytem(studentRecord);
    res.status(StatusCode.Created).json({ message: 'Student registered successfully', data: {_id: userResult.insertedId, username: username}, statusCode: StatusCode.Created });
});
