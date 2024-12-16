import express from 'express';
import Database from '../../controller/database';
import { StatusCode } from '../../enum/statusCode';
import { ObjectTypes } from '../../enum/ObjectTypes';
let router = express.Router();
export default router;

// Get all topics

router.post('/dsa/topics',async function (req: Request, res: any) {
    try {
        let studentQuery = await Database.querySytem({ objType: ObjectTypes.TOPIC});
        if (!studentQuery) {
            return studentQuery;
        }
        res.status(StatusCode.Success).json({data: studentQuery, message: 'Topic list retrieved successfully', statusCode: StatusCode.Created });
    } catch (error) {
        return res.status(StatusCode.serverError).json({ message: 'Internal server error', statusCode: StatusCode.serverError });
    }
});

// Update problem completion status
router.patch('/:topicId/problem/:problemId', async function (req: Request, res: any) {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(StatusCode.BadRequest).json({ message: 'Request body is empty', statusCode: StatusCode.BadRequest });
    }
    let result = await Database.updateSystem(req);
    if (result.modifiedCount === 0) {
        return res.status(StatusCode.BadRequest).json({ message: 'Problem not found', statusCode: StatusCode.BadRequest });
    }
    res.status(StatusCode.Success).json({data: result, message: 'Topic updated successfully', statusCode: StatusCode.Created });
});

module.exports = router;
