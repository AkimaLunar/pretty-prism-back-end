import moment from 'moment';

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
