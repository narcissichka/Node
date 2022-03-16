import { resolve, join } from "path";
import { createServer } from "http";
import {
  lstatSync,
  existsSync,
  createReadStream,
  readdirSync,
  readFileSync,
} from "fs";

const indexFile = resolve("index.html");

const server = createServer((req, res) => {
  const fullPath = resolve(process.cwd(), req.url);

  if (!existsSync(fullPath)) {
    return res.end("Not found");
  } else if (lstatSync(fullPath).isFile()) {
    return createReadStream(fullPath).pipe(res);
  }

  let files = "";
  readdirSync(fullPath).forEach((file) => {
    const path = join(req.url, file);
    files += `<a href="${path}">${file}</a><br/>`;
  });
  const HTML = readFileSync(indexFile, "utf-8").replace("block", files);
  res.setHeader("Content-Type", "text/html");
  return res.end(HTML);
});
server.listen(3000);
