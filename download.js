// get params
const TARGET_URL = process.argv[2];
const TARGET_HOST = process.argv[3];
const TARGET_UUID = process.argv[4];

console.log(`Params: [${TARGET_URL}] [${TARGET_HOST}] [${TARGET_UUID}]`);

try {
  if (!TARGET_URL.startsWith('http')) {
    throw new Error(`invalid TARGET_URL [${TARGET_URL}], it's not URL`);
  }
  if (!TARGET_HOST) {
    throw new Error('undefined TARGET_HOST');
  }
  if (!TARGET_UUID) {
    throw new Error('undefined TARGET_UUID');
  }
} catch (e) {
  console.error(e.message);
  throw e.message;
}

// load environment values
require('dotenv').config();
const OUTPUT_TARGET = process.env.OUTPUT_TARGET;
const OUTPUT_BUCKET = process.env.OUTPUT_BUCKET;
const OUTPUT_PATH = `${OUTPUT_BUCKET}/${TARGET_HOST}`
const USER_AGENT = process.env.USER_AGENT;

console.log(`Envs: [${OUTPUT_TARGET}] [${OUTPUT_BUCKET}] [${OUTPUT_PATH}] [${USER_AGENT}]`);

// create directory, if it needs
const fs = require('fs');
if (OUTPUT_TARGET === 'local' && !fs.existsSync(OUTPUT_PATH)) {
  try {
    fs.mkdirSync(OUTPUT_PATH, { recursive: true });
    console.log(`Created ${OUTPUT_PATH}`);
  } catch (e) {
    console.error(e.message);
    throw e.message;
  }
}

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//  Download
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
const axios = require('axios');

const aws = require('aws-sdk');
const AWS_S3_CLIENT = new aws.S3({ region: 'ap-northeast-1' });

(async () => {
  try {
    console.log(`download start [${TARGET_URL}]`);
    const ret = await axios.get(TARGET_URL, { timeout : 30000, headers: { 'User-Agent': USER_AGENT } });
    if (ret.status > 400) {
      console.error(`download failed [${TARGET_URL}]: ${ret.status}`);
    } else {
      const data = ret.data.trim();

      if (OUTPUT_TARGET === 'local') {
        fs.writeFile(`${OUTPUT_PATH}/robots.txt`, data, (e) => {
          if (e) {
            console.error(e.message);
          }
        });
      } else {
        await uploadTxt(data);
      }
    }

  } catch (e) {
    console.error(e.message);
  }
})();

async function uploadTxt(data) {
  console.log(`upload txt: ${OUTPUT_BUCKET}/${TARGET_HOST}/robots.txt`);
  await AWS_S3_CLIENT.putObject({
    Bucket: OUTPUT_BUCKET,
    Key: `${TARGET_HOST}/robots.txt`,
    Body: data,
  }).promise();
}
