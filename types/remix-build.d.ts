// declare the shape of Remix's server build output
declare module "*./build/server/index.js" {
  import type { ServerBuild } from "@remix-run/node";
  const build: ServerBuild;
  export = build;
}
