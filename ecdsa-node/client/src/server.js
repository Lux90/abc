import axios from "axios";

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json
BigInt.prototype.toJSON = function() { return this.toString() };

const server = axios.create({
  baseURL: "http://localhost:3042",
});

export default server;
