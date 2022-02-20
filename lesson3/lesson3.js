/*
Напишите программу, которая находит в этом файле все записи 
с ip-адресами 89.123.1.41 и 34.48.240.111, а также сохраняет 
их в отдельные файлы с названием “%ip-адрес%_requests.log”.
*/
const fs = require("fs");
const readline = require("readline");
const ACCESS_LOG = "./access.log";
const OUTPUT_LOG = "_requests.log";
const FIRST_IP = "89.123.1.41";
const SECOND_IP = "34.48.240.111";

function formLog(ip, accessLog, outputLog) {
  const readLine = readline.createInterface({
    input: fs.createReadStream(accessLog, { encoding: "utf-8" }),
  });
  const writeStreamFirst = fs.createWriteStream(ip + outputLog, {
    encoding: "utf-8",
    //  flags: "a",
  });

  readLine.on("line", (line) => {
    if (line.includes(ip)) {
      writeStreamFirst.write(line + "\n");
    }
  });
}

formLog(FIRST_IP, ACCESS_LOG, OUTPUT_LOG);
formLog(SECOND_IP, ACCESS_LOG, OUTPUT_LOG);
