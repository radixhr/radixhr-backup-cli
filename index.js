"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var AWS = require("aws-sdk");
var path_1 = require("path");
var fs_1 = require("fs");
var dotenv_1 = require("dotenv");
var commander_1 = require("commander");
var AdmZip = require("adm-zip");
var fs = require("fs");
var path = require("path");
// Create a new CLI program
var program = new commander_1.Command();
// Configure environment variables
(0, dotenv_1.config)();
// Set up AWS configuration
var region = process.env.REGION || "";
var endpoint = new AWS.Endpoint(process.env.SPACE_END_POINT || "");
var credentials = new AWS.Credentials({
    accessKeyId: process.env.ACCESS_KEY_ID || "",
    secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
});
var config = {
    endpoint: endpoint,
    credentials: credentials,
    region: region,
};
// Create a new S3 object
var s3 = new AWS.S3(config);
// Function to list root folders in the specified bucket
var listRootFolders = function () { return __awaiter(void 0, void 0, void 0, function () {
    var params, data, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                params = {
                    Bucket: process.env.BUCKET_NAME || "",
                    Delimiter: "/",
                };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, s3.listObjectsV2(params).promise()];
            case 2:
                data = _b.sent();
                return [2 /*return*/, (_a = data.CommonPrefixes) === null || _a === void 0 ? void 0 : _a.map(function (prefix) { return prefix.Prefix; })];
            case 3:
                err_1 = _b.sent();
                throw err_1;
            case 4: return [2 /*return*/];
        }
    });
}); };
// Function to download a file from S3 bucket
var downloadFile = function (_a) {
    var bucket = _a.bucket, key = _a.key;
    return __awaiter(void 0, void 0, void 0, function () {
        var filePath, writeStream, params, response, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    filePath = "./devx/".concat(key);
                    (0, fs_1.mkdirSync)((0, path_1.dirname)(filePath), { recursive: true });
                    writeStream = (0, fs_1.createWriteStream)(filePath);
                    writeStream.on("error", function (err) {
                        console.error("Error writing to ".concat(filePath, ":"), err);
                    });
                    writeStream.on("finish", function () {
                        console.log("Downloaded ".concat(key));
                    });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    params = {
                        Bucket: bucket,
                        Key: key,
                    };
                    return [4 /*yield*/, s3.getObject(params).promise()];
                case 2:
                    response = _b.sent();
                    writeStream.write(response.Body);
                    writeStream.end();
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _b.sent();
                    console.error("Error downloading ".concat(key, ":"), err_2);
                    writeStream.end();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
var listObjectsInFolder = function (folder) { return __awaiter(void 0, void 0, void 0, function () {
    var params, allObjects, shouldContinue, continuationToken, data, keys, err_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                params = {
                    Bucket: process.env.BUCKET_NAME || "",
                    Prefix: folder,
                };
                allObjects = [];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                shouldContinue = true;
                continuationToken = undefined;
                _b.label = 2;
            case 2:
                if (!shouldContinue) return [3 /*break*/, 4];
                return [4 /*yield*/, s3
                        .listObjectsV2(__assign(__assign({}, params), { ContinuationToken: continuationToken }))
                        .promise()];
            case 3:
                data = _b.sent();
                keys = ((_a = data.Contents) === null || _a === void 0 ? void 0 : _a.map(function (obj) { return obj.Key || ""; })) || [];
                allObjects = allObjects.concat(keys);
                if (data.NextContinuationToken) {
                    continuationToken = data.NextContinuationToken;
                }
                else {
                    shouldContinue = false;
                }
                return [3 /*break*/, 2];
            case 4: return [2 /*return*/, allObjects];
            case 5:
                err_3 = _b.sent();
                throw err_3;
            case 6: return [2 /*return*/];
        }
    });
}); };
// Function to list objects in the specified bucket and prefix
var listAllObjects = function () { return __awaiter(void 0, void 0, void 0, function () {
    var params, allObjects, shouldContinue, continuationToken, data, keys, err_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                params = {
                    Bucket: process.env.BUCKET_NAME || "",
                    Prefix: "",
                };
                allObjects = [];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                shouldContinue = true;
                continuationToken = undefined;
                _b.label = 2;
            case 2:
                if (!shouldContinue) return [3 /*break*/, 4];
                return [4 /*yield*/, s3
                        .listObjectsV2(__assign(__assign({}, params), { ContinuationToken: continuationToken }))
                        .promise()];
            case 3:
                data = _b.sent();
                keys = ((_a = data.Contents) === null || _a === void 0 ? void 0 : _a.map(function (obj) { return obj.Key || ""; })) || [];
                allObjects = allObjects.concat(keys);
                if (data.NextContinuationToken) {
                    continuationToken = data.NextContinuationToken;
                }
                else {
                    shouldContinue = false;
                }
                return [3 /*break*/, 2];
            case 4: return [2 /*return*/, allObjects];
            case 5:
                err_4 = _b.sent();
                throw err_4;
            case 6: return [2 /*return*/];
        }
    });
}); };
// Function to zip a folder
var zipFolder = function (folderPath, outputPath) { return __awaiter(void 0, void 0, void 0, function () {
    var zip, files, _i, files_1, file, filePath, fileStats, fileData;
    return __generator(this, function (_a) {
        try {
            zip = new AdmZip();
            files = fs.readdirSync(folderPath);
            for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
                file = files_1[_i];
                filePath = path.join(folderPath, file);
                fileStats = fs.statSync(filePath);
                fileData = fs.readFileSync(filePath);
                zip.addFile(file, fileData, "", fileStats.mode);
            }
            zip.writeZip(outputPath);
            console.log("Folder ".concat(folderPath, " has been zipped to ").concat(outputPath));
        }
        catch (err) {
            throw err;
        }
        return [2 /*return*/];
    });
}); };
// Define CLI commands
program
    .command("start")
    .description("Start the project")
    .action(function () {
    console.log("Document backup has been started");
});
program
    .command("list")
    .description("List all root folders in the bucket")
    .action(function () { return __awaiter(void 0, void 0, void 0, function () {
    var rootFolders, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, listRootFolders()];
            case 1:
                rootFolders = _a.sent();
                console.log("Root folders:");
                rootFolders === null || rootFolders === void 0 ? void 0 : rootFolders.forEach(function (folder, index) {
                    console.log("".concat(index + 1, ". ").concat(folder));
                });
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                console.error("Error:", err_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Action for backup a folder and zipping it
program
    .command("backup <folderName>")
    .description("Backup a specified root folder from the S3 bucket and zip it")
    .action(function (folderName) { return __awaiter(void 0, void 0, void 0, function () {
    var objectsInFolder, _i, objectsInFolder_1, objectKey, folderPath, outputPath, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                return [4 /*yield*/, listObjectsInFolder(folderName)];
            case 1:
                objectsInFolder = _a.sent();
                _i = 0, objectsInFolder_1 = objectsInFolder;
                _a.label = 2;
            case 2:
                if (!(_i < objectsInFolder_1.length)) return [3 /*break*/, 5];
                objectKey = objectsInFolder_1[_i];
                return [4 /*yield*/, downloadFile({
                        bucket: process.env.BUCKET_NAME,
                        key: objectKey,
                    })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                console.log("Folder ".concat(folderName, " backuped successfully."));
                folderPath = "./devx/".concat(folderName);
                outputPath = "./devx/".concat(folderName, ".zip");
                return [4 /*yield*/, zipFolder(folderPath, outputPath)];
            case 6:
                _a.sent();
                return [3 /*break*/, 8];
            case 7:
                err_6 = _a.sent();
                console.error("Error backuping and zipping folder ".concat(folderName, ":"), err_6);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
program
    .command("backupAll")
    .description("Backup all files within a specified root folder from the S3 bucket")
    .action(function () { return __awaiter(void 0, void 0, void 0, function () {
    var objectsInFolder, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, listAllObjects()];
            case 1:
                objectsInFolder = _a.sent();
                objectsInFolder.forEach(function (objectKey) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, downloadFile({ bucket: process.env.BUCKET_NAME, key: objectKey })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [3 /*break*/, 3];
            case 2:
                err_7 = _a.sent();
                err_7;
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Parse the command line arguments
program.parse(process.argv);
