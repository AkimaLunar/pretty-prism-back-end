import { ObjectID } from 'mongodb';

const polishes = [
  {
    id: '000',
    images: [
      'https://pretty-prism.nyc3.digitaloceanspaces.com/assets/default_avatar.png'
    ],
    name: 'Purpplrr',
    brand: 'INC',
    location: '3745802983457,3745802983457',
    status: 'Ready'
  }
];

export default {
  Query: {
    allPolishes: async (root, data, { mongo: { Polishes } }) => await Polishes.find({}).toArray()
  },

  Mutation: {
    createPolish: async (root, data, { mongo: { Polishes } }) => {
      const response = await Polishes.insert(data);
      return Object.assign({ id: response.insertedIds[0] }, data);
    }
  },

  Polish: {
    id: root => root._id || root.id
  }
};
