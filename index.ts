import * as AWS from "aws-sdk";
import { dirname } from "path";
import { createWriteStream, mkdirSync } from "fs";
import { config as dotenvConfig } from "dotenv";
import { Command } from "commander";
import * as AdmZip from "adm-zip";
import * as fs from "fs";
import * as path from "path";

// Create a new CLI program
const program = new Command();

// Configure environment variables
dotenvConfig();

// Set up AWS configuration
const region = process.env.REGION || "";
const endpoint = new AWS.Endpoint(process.env.SPACE_END_POINT || "");
const credentials = new AWS.Credentials({
  accessKeyId: process.env.ACCESS_KEY_ID || "",
  secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
});

const config = {
  endpoint: endpoint,
  credentials: credentials,
  region: region,
};

// Create a new S3 object
const s3 = new AWS.S3(config);

// Function to list root folders in the specified bucket
const listRootFolders = async () => {
  const params = {
    Bucket: process.env.BUCKET_NAME || "",
    Delimiter: "/",
  };

  try {
    const data = await s3.listObjectsV2(params).promise();
    return data.CommonPrefixes?.map((prefix) => prefix.Prefix);
  } catch (err) {
    throw err;
  }
};

// Function to download a file from S3 bucket
const downloadFile = async ({ bucket, key }) => {
  const filePath = `./devx/${key}`;

  mkdirSync(dirname(filePath), { recursive: true });
  const writeStream = createWriteStream(filePath);

  writeStream.on("error", (err) => {
    console.error(`Error writing to ${filePath}:`, err);
  });

  writeStream.on("finish", () => {
    console.log(`Downloaded ${key}`);
  });

  try {
    const params = {
      Bucket: bucket,
      Key: key,
    };

    const response = await s3.getObject(params).promise();

    writeStream.write(response.Body);
    writeStream.end();
  } catch (err) {
    console.error(`Error downloading ${key}:`, err);
    writeStream.end();
  }
};

const listObjectsInFolder = async (folder: string) => {
  const params = {
    Bucket: process.env.BUCKET_NAME || "",
    Prefix: folder,
  };

  let allObjects: string[] = [];

  try {
    let shouldContinue = true;
    let continuationToken: string | undefined = undefined;

    while (shouldContinue) {
      const data = await s3
        .listObjectsV2({ ...params, ContinuationToken: continuationToken })
        .promise();

      // Extract keys of objects
      const keys: string[] = data.Contents?.map((obj) => obj.Key || "") || [];
      allObjects = allObjects.concat(keys);

      if (data.NextContinuationToken) {
        continuationToken = data.NextContinuationToken;
      } else {
        shouldContinue = false;
      }
    }

    return allObjects;
  } catch (err) {
    throw err;
  }
};

// Function to zip a folder
const zipFolder = async (folderPath, outputPath) => {
  try {
    const zip = new AdmZip();
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const fileStats = fs.statSync(filePath);
      const fileData = fs.readFileSync(filePath);

      zip.addFile(file, fileData, "", fileStats.mode);
    }

    zip.writeZip(outputPath);
    console.log(`Folder ${folderPath} has been zipped to ${outputPath}`);
  } catch (err) {
    throw err;
  }
};

// Define CLI commands
program
  .command("start")
  .description("Start the project")
  .action(() => {
    console.log("Document backup has been started");
  });

program
  .command("list")
  .description("List all root folders in the bucket")
  .action(async () => {
    try {
      const rootFolders = await listRootFolders();
      console.log("Root folders:");
      rootFolders?.forEach((folder, index) => {
        console.log(`${index + 1}. ${folder}`);
      });
    } catch (err) {
      console.error("Error:", err);
    }
  });

// Action for backup a folder and zipping it
program
  .command("backup <folderName>")
  .description("Backup a specified root folder from the S3 bucket and zip it")
  .action(async (folderName) => {
    try {
      const objectsInFolder = await listObjectsInFolder(folderName);

      for (const objectKey of objectsInFolder) {
        await downloadFile({
          bucket: process.env.BUCKET_NAME,
          key: objectKey,
        });
      }

      console.log(`Folder ${folderName} backuped successfully.`);

      const folderPath = `./devx/${folderName}`;
      const outputPath = `./devx/${folderName}.zip`;
      await zipFolder(folderPath, outputPath);
    } catch (err) {
      console.error(`Error backuping and zipping folder ${folderName}:`, err);
    }
  });

// Parse the command line arguments
program.parse(process.argv);
