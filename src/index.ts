import { Skeleton } from "./dummy-module/index.js";

try {
  main();
} catch (err) {
  console.log(err);
}

function main() {
  console.log("Hello Node JS from a typescript file!");
  Skeleton();
}
