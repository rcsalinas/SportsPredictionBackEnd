import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient, Db } from "mongodb";

let db: Db;

export async function connectInMemoryMongo() {
	const mongod = await MongoMemoryServer.create();
	const uri = mongod.getUri();
	const client = new MongoClient(uri);
	await client.connect();
	db = client.db("sports");
	console.log("Connected to in-memory MongoDB");
	return db;
}

export function getDb() {
	if (!db) throw new Error("MongoDB not connected!");
	return db;
}
