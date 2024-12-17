import express from 'express';
import Database from '../../controller/database';
import { StatusCode } from '../../enum/statusCode';
import { ObjectTypes } from '../../enum/ObjectTypes';
import { title } from 'process';
let router = express.Router();
export default router;

// create topic admin can only create topics future scope of this api
router.post('/dsa/topic',async function (req: any, res: any) {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(StatusCode.BadRequest).json({ message: 'Request body is empty', statusCode: StatusCode.BadRequest });
        }
        if (!req.body.title || !req.body.problems) {
            return res.status(StatusCode.BadRequest).json({ message: 'Required field missing title or problems', statusCode: StatusCode.BadRequest });
        }
        let topicQuery = await Database.querySytem({ objType: ObjectTypes.TOPIC, title: req.body.title });
        if (topicQuery.length > 0) {
            return res.status(StatusCode.BadRequest).json({ message: 'Topic with same title already exists', statusCode: StatusCode.BadRequest });
        }
        const topicRecord = { objType: ObjectTypes.TOPIC, title: req.body.title, problems: req.body.problems };
        const topicResult = await Database.saveSytem(topicRecord);
        if (!topicResult) {
            return topicResult;
        }
        res.status(StatusCode.Created).json({ message: 'Topic created successfully', data: {_id: topicResult.insertedId, name: req.body.title}, statusCode: StatusCode.Created });
    } catch (error) {
        return res.status(StatusCode.serverError).json({ message: 'Internal server error', statusCode: StatusCode.serverError });
    }
});

// Get all topics
router.get('/dsa/topics',async function (req: Request, res: any) {
    try {
        let studentQuery = await Database.querySytem({ objType: ObjectTypes.TOPIC});
        if (!studentQuery) {
            return studentQuery;
        }
        res.status(StatusCode.Success).json({data: studentQuery, message: 'Topic list retrieved successfully', statusCode: StatusCode.Success });
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
