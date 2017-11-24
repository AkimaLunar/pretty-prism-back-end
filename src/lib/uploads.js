import moment from 'moment';
import AWS from 'aws-sdk';
import { logger } from '../lib/logger';

import { ACCESS_KEY_ID, SECRET_ACCESS_KEY, REGION, BUCKET } from '../config';

export const formatFilename = (filename, username) => {
  const date = moment().format('YYYYMMDD');
  const randomString = Math.random()
    .toString(36)
    .substring(2, 7);
  const cleanFileName = filename.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const newFilename = `polishes/${username}/${date}-${randomString}-${cleanFileName}`;
  return newFilename.substring(0, 60);
};

export const processUpload = async (upload, size, username) => {
  const { stream, filename, mimetype, encoding } = await upload;
  stream.length = size;
  const path = formatFilename(filename, username);
  return Object.assign({ filename, mimetype, encoding, path, stream });
};

export const DOUpload = image => {
  const spacesEndpoint = new AWS.Endpoint(`${REGION}.digitaloceanspaces.com`);
  const S3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY
  });
  const upload = new Promise((resolve, reject) => {
    S3.upload(
      {
        Bucket: BUCKET,
        Key: image.path,
        Body: image.stream,
        ACL: 'public-read'
      },
      (err, data) => {
        if (err) {
          logger(err, err.stack);
          reject(err);
        }
        resolve(data.Location);
      }
    );
  });
  return upload;
};
