import { MongoClient, ObjectId } from 'mongodb';

export default class Database {
    public static db: any;


    static async connect() {
        const connectionString: any = process.env.DB_CONNECTION;
        const con = await MongoClient.connect(connectionString);
		Database.db = con.db();
        return ('database connected successfully');
    }

    static async saveSytem(record: any) {
        const result = await Database.db.collection(record.objType).insertOne(record);
        return result;
    }
    
    static async querySytem(record: any) {
        const result = await Database.db.collection(record.objType).find(record).toArray(); 
        return result;
    }

    static async updateSystem(req: any) {
        const { topicId, problemId } = req.params;
        const result = await Database.db.collection({ _id: topicId, 'problems._id': problemId },
            { $set: { 'problems.$.completed': req.body.completed } });
        return result;
    }
}