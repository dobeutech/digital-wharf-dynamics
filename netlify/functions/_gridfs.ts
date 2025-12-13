import { GridFSBucket } from 'mongodb';
import { getMongoDb } from './_mongo';

let bucketPromise: Promise<GridFSBucket> | null = null;

export async function getGridFsBucket(): Promise<GridFSBucket> {
  if (bucketPromise) return bucketPromise;
  bucketPromise = (async () => {
    const db = await getMongoDb();
    const bucketName = process.env.GRIDFS_BUCKET?.trim() || 'files';
    return new GridFSBucket(db, { bucketName });
  })();
  return bucketPromise;
}


