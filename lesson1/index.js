import colors from "colors";
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.log("invalid number of arguments");
} else if (isNaN(args[0]) || isNaN(args[1])) {
  console.log("both arguments should be numbers");
} else if (args[0] >= args[1]) {
  console.log("invalid argument order, left end of interval should be less");
} else if (args[0] < 0 && args[1] <= 0) {
  console.log(
    "all primary numbers are positive, there are no prime numbers in specified interval"
  );
} else {
  args[0] = parseInt(args[0]);
  args[1] = parseInt(args[1]);
  let prime = [];
  for (let i = args[0]; i <= args[1]; i++) {
    if (i < 2) continue;
    let flag = true;
    for (let j = 2; j <= i / 2; j++) {
      if (i % j == 0) {
        flag = false;
        break;
      }
    }
    if (flag) prime.push(i);
  }
  if (prime.length == 0) {
    console.log("there are no prime numbers in specified interval");
  } else {
    for (let i = 0; i < prime.length; i++) {
      if ((i + 1) % 3 == 0) console.log(colors.red(prime[i]));
      else if ((i + 1) % 3 == 1) console.log(colors.green(prime[i]));
      else console.log(colors.yellow(prime[i]));
    }
  }
}
