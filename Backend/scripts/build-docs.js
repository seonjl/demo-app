import fs from "fs";
import yaml from "js-yaml";
import path from "path";

const __dirname = path.resolve();

function readDirectory(dir, result = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      readDirectory(fullPath, result);
    } else {
      result.push(fullPath);
    }
  });
  return result;
}

function generatePathsObject(apiSchemas) {
  const paths = {};

  apiSchemas.forEach((apiSchema) => {
    const pathItem = generatePathItemObject(apiSchema);
    Object.assign(paths, pathItem);
  });

  return paths;
}

function generatePathItemObject(apiSchema) {
  const {
    path,
    method,
    tags,
    summary,
    description,
    operationId,
    parameters,
    requestBody,
    responses,
  } = apiSchema;

  const operationObject = {
    tags,
    summary,
    description,
    operationId: operationId || path + "-" + method,
    parameters,
    requestBody,
    responses,
  };
  const pathItem = {
    [path]: {
      [method]: operationObject,
    },
  };

  return { path, method, operationObject, pathItem };
}

async function* importApiSchemas(targetFiles) {
  for (const file of targetFiles) {
    try {
      const imported = await import(path.resolve(file));
      yield imported.apiSchema;
    } catch (error) {
      // console.log("📢 error");
      // console.log(error);
    }
  }
}

async function writeOpenapiJson(openapiObject) {
  if (!fs.existsSync("./docs")) {
    fs.mkdirSync("./docs");
  }

  const openapiJson = JSON.stringify(openapiObject, null, 2);
  fs.writeFileSync("./docs/openapi.json", openapiJson);
}

async function writeOpenapiYamlAndHtml(openapiObject) {
  if (!fs.existsSync("./docs")) {
    fs.mkdirSync("./docs");
  }

  const openapiYaml = yaml.dump(openapiObject);
  fs.writeFileSync("./docs/openapi.yaml", openapiYaml);

  const openapiHtml = `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <link rel="icon" type="image/svg+xml" href="https://cdn.oaistatic.com/_next/static/media/favicon-32x32.630a2b99.png"/>
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <title>API Docs</title>
      <!-- Embed elements Elements via Web Component -->
      <script src="https://unpkg.com/@stoplight/elements/web-components.min.js"></script>
      <link rel="stylesheet" href="https://unpkg.com/@stoplight/elements/styles.min.css">
    </head>
    <body>
      <elements-api id="docs" router="hash" layout="sidebar"></elements-api>
      <script>
      (async () => {
        const docs = document.getElementById('docs');
        const apiDescriptionDocument = ${JSON.stringify(openapiYaml)};
      
        docs.apiDescriptionDocument = apiDescriptionDocument;
      })();
      </script>

    </body>
  </html>
`;

  fs.writeFileSync("./docs/openapi.html", openapiHtml);
}

async function main() {
  const targetFiles = readDirectory("./dist");

  const openapiObject = {
    openapi: "3.1.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
    },
    servers: [
      {
        url: "https://3b7krqgdca.execute-api.ap-northeast-2.amazonaws.com",
        description: "Stag API Server",
      },
    ],
    paths: {},
  };

  const pathsObject = {};

  for await (const apiSchema of importApiSchemas(targetFiles)) {
    if (!apiSchema) {
      continue;
    }

    const { path, method, operationObject } = generatePathItemObject(apiSchema);

    mergePathItemToPaths(pathsObject, { path, method, operationObject });
  }

  openapiObject.paths = pathsObject;

  await writeOpenapiJson(openapiObject);
  await writeOpenapiYamlAndHtml(openapiObject);
}

function mergePathItemToPaths(pathsObject, { path, method, operationObject }) {
  if (pathsObject[path]) {
    pathsObject[path][method] = operationObject;
  } else {
    pathsObject[path] = {
      [method]: operationObject,
    };
  }

  return pathsObject;
}

// iife
(() => {
  main();
})();
