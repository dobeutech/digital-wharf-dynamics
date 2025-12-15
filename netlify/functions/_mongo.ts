import { MongoClient, ServerApiVersion } from "mongodb";

let clientPromise: Promise<MongoClient> | null = null;

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val || val.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return val;
}

export async function getMongoClient(): Promise<MongoClient> {
  if (clientPromise) return clientPromise;

  const uri = requireEnv("MONGODB_URI");

  // Do NOT log uri; it contains secrets.
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  clientPromise = client.connect().catch((err) => {
    clientPromise = null;
    throw err;
  });
  return clientPromise;
}

export async function getMongoDb() {
  const client = await getMongoClient();
  const dbName = process.env.MONGODB_DB_NAME?.trim() || "app";
  return client.db(dbName);
}
