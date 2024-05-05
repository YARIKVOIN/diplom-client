import multiparty from 'multiparty';
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import fs from 'fs';
import mime from 'mime-types';
const bucketName = 'hjy6578';

export default async function handle(req,res) {

  const form = new multiparty.Form();
  const {fields,files} = await new Promise((resolve,reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({fields,files});
    });
  });
  console.log('length:', files.file.length);
  const client = new S3Client({
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    endpoint: "https://s3.storage.selcloud.ru",
    s3ForcePathStyle: true,
    region: "ru-1",
    apiVersion: "latest"
  });
  const links = [];
  for (const file of files.file) {
    const ext = file.originalFilename.split('.').pop();
    const newFilename = Date.now() + '.' + ext;
    await client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: newFilename,
      Body: fs.readFileSync(file.path),
      ACL: 'public-read',
      ContentType: mime.lookup(file.path),
    }));
    const link = `https://b1869257-3e79-4c93-9da8-072ccb2ff249.selstorage.ru/${newFilename}`;
    links.push(link);
  }
  return res.json({links});
}

export const config = {
  api: {bodyParser: false},
};