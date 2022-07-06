// get params
const TARGET_URL = process.argv[2];
const TARGET_HOST = process.argv[3];

console.log(`Params: [${TARGET_URL}] [${TARGET_HOST}]`);

try {
  if (!TARGET_URL.startsWith("http")) {
    throw new Error(`invalid TARGET_URL [${TARGET_URL}], it's not URL`);
  }
  if (!TARGET_HOST) {
    throw new Error("undefined TARGET_HOST");
  }
} catch (e) {
  console.error(e.message);
  throw e.message;
}

// load environment values
require("dotenv").config();
const OUTPUT_BUCKET = process.env.OUTPUT_BUCKET || null;
const OUTPUT_DIR = process.env.OUTPUT_DIR || null;
const USER_AGENT = process.env.USER_AGENT || "ArchiveDownloader";

console.log(`Envs: [[${OUTPUT_BUCKET}] [${OUTPUT_DIR}] [${USER_AGENT}]`);

// create directory, if it needs
const fs = require("fs");
if (OUTPUT_DIR && !fs.existsSync(`${OUTPUT_DIR}/${TARGET_HOST}`)) {
  try {
    fs.mkdirSync(`${OUTPUT_DIR}/${TARGET_HOST}`, { recursive: true });
    console.log(`Created ${`${OUTPUT_DIR}/${TARGET_HOST}`}`);
  } catch (e) {
    console.error(e.message);
    throw e.message;
  }
}

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//  Download
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
const axios = require("axios");

const aws = require("aws-sdk");
const AWS_REGION = process.env.AWS_REGION;
const AWS_S3_CLIENT = new aws.S3({ region: AWS_REGION });

(async () => {
  try {
    console.log(`download start [${TARGET_URL}]`);
    const ret = await axios.get(TARGET_URL, {
      timeout: 30000,
      headers: { "User-Agent": USER_AGENT },
    });
    if (ret.status > 400) {
      createRobotstxt();
      console.error(`download failed [${TARGET_URL}]: ${ret.status}`);
    } else {
      const data = ret.data.trim();

      // save to local
      if (OUTPUT_DIR) {
        fs.writeFile(
          `${`${OUTPUT_DIR}/${TARGET_HOST}`}/robots.txt`,
          data,
          (e) => {
            if (e) {
              console.error(e.message);
            }
          }
        );
      }
      // save to s3
      if (OUTPUT_BUCKET) {
        await uploadTxt(data);
      }
    }
  } catch (e) {
    createRobotstxt();
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

function createRobotstxt() {
  const data = "User-agent: *\nAllow: /";
  fs.writeFile(`${`${OUTPUT_DIR}/${TARGET_HOST}`}/robots.txt`, data, (e) => {
    if (e) {
      console.error(e.message);
    }
  });
}
