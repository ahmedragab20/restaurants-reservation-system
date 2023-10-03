/**
  AR-CATCH is a TS library I've built as a superpower Fetch() API wrapper.
  it has all the features of Fetch() API with more powerfull additions such as...
  - Flixible Syntax
  - Caching (out of the box)
  - state management (out of the box)
  - Request, Response, and Interceptors
  ________________________________________________________________________________
  it's built completely in TypeScript, and step by step with JSDoc comments.
  to provide a better developer experience and easier learning curve.
  ________________________________________________________________________________
  npm: https://www.npmjs.com/package/ar-catch
  github: https://github.com/ahmedragab20/ar-catch
*/

import { config } from "ar-catch";

config({
  baseURL: "https://api.foodics.dev/v5",
  onReq(req) {
    req.headers.set("Content-Type", "application/json");
    req.headers.set("Accept", "application/json");
    req.headers.set(
      "Authorization",
      `Bearer ${process.env.VUE_APP_API_ACCESS_TOKEN}`
    );
    req.headers.set("Access-Control-Allow-Origin", "*");
  },
});
