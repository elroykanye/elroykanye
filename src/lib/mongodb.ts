import { MongoClient, type Db, type Collection, type ObjectId } from "mongodb";

// Connection is created lazily and only at request time (inside route handlers),
// never at build time. If MONGODB_URI is unset the site still builds and runs —
// the interactive bits (comments, likes, submissions) just report as unavailable.

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "elroykimbi";

let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // Reuse the connection across hot reloads in dev to avoid exhausting it.
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function isDbConfigured(): boolean {
  return Boolean(uri);
}

function getClientPromise(): Promise<MongoClient> {
  if (!uri) throw new Error("MONGODB_URI is not set");

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri).connect();
    }
    return global._mongoClientPromise;
  }

  if (!clientPromise) clientPromise = new MongoClient(uri).connect();
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(dbName);
}

// ---- Document shapes ----

export type CommentDoc = {
  _id?: ObjectId;
  postSlug: string;
  name: string;
  body: string;
  status: "pending" | "approved";
  createdAt: Date;
};

export type LikeDoc = {
  _id?: ObjectId;
  postSlug: string;
  visitorIds: string[];
};

export type SubmissionDoc = {
  _id?: ObjectId;
  name?: string;
  role?: string;
  email?: string;
  story: string;
  canShare: boolean;
  createdAt: Date;
};

export async function comments(): Promise<Collection<CommentDoc>> {
  return (await getDb()).collection<CommentDoc>("comments");
}

export async function likes(): Promise<Collection<LikeDoc>> {
  return (await getDb()).collection<LikeDoc>("likes");
}

export async function submissions(): Promise<Collection<SubmissionDoc>> {
  return (await getDb()).collection<SubmissionDoc>("submissions");
}
