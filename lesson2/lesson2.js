/*
Напишите программу, которая будет принимать на вход несколько аргументов: 
дату и время в формате «год-месяц-день-час-минута-секунда». Задача программы 
— создавать таймер с обратным отсчётом: посекундный вывод в терминал 
состояния таймера. По истечении таймера, вместо сообщения о том, сколько осталось, 
требуется показать сообщение о завершении его работы. Важно, чтобы работа программы 
основывалась на событиях.
*/
const EventEmitter = require("events");
const emitter = new EventEmitter();
const moment = require("moment");

const args = process.argv.slice(2);
const today = moment();
const future = moment(args.join(""), "YYYY MM DD hh:mm:ss");

timeLeft = moment.duration(future.diff(today));

const defineDifference = (diff) => {
  if (diff.years() != 0)
    return (
      [diff.years(), diff.months(), diff.days()].join(" ") +
      " " +
      [diff.hours(), diff.minutes(), diff.seconds()].join(":")
    );
  else if (diff.months() != 0)
    return (
      [diff.months(), diff.days()].join(" ") +
      " " +
      [diff.hours(), diff.minutes(), diff.seconds()].join(":")
    );
  else if (diff.years() != 0)
    return (
      diff.days() +
      " " +
      [diff.hours(), diff.minutes(), diff.seconds()].join(":")
    );
  else if (diff.hours() != 0)
    return [diff.hours(), diff.minutes(), diff.seconds()].join(":");
  else return [diff.minutes(), diff.seconds()].join(":");
};

function timer() {
  setTimeout(() => {
    if (timeLeft <= 0) {
      emitter.emit("end");
    } else {
      emitter.emit("tick");
      timer();
    }
  }, 1000);
}

emitter.on("start", () => {
  console.log(`Current date: ${today.format("YYYY MM DD hh:mm:ss a")}
    Date we are counting to: ${future.format("YYYY MM DD hh:mm:ss a")}
    Time left: ${defineDifference(timeLeft)}
    Timer is started...`);
});
emitter.on("tick", () => {
  timeLeft = moment.duration(future.diff(moment()));
  if (timeLeft > 0) {
    console.log(defineDifference(timeLeft));
  }
});
emitter.on("end", () => {
  console.log("...Timer is stopped");
});

emitter.emit("start");
timer();
