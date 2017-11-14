import { MongoClient } from 'mongodb';
import { DATABASE_URL } from './config';

export default async () => {
  const db = await MongoClient.connect(DATABASE_URL);
  return {
    Polishes: db.collection('polishes'),
    Users: db.collection('users'),
    Comments: db.collection('comments'),
    Messages: db.collection('messages')
  };
};
