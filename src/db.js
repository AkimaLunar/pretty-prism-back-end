import { MongoClient } from 'mongodb';
import { DATABASE_URL } from './config';

export default async () => {
  const db = await MongoClient.connect('mongodb://blueOperator:BombasticJewel!@ds151973.mlab.com:51973/pretty-prism-dev');
  return {
    Polishes: db.collection('polishes'),
    Users: db.collection('users'),
    Comments: db.collection('comments'),
    Chats: db.collection('chats'),
    Messages: db.collection('messages')
  };
};
