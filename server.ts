import express from "express";
import { createRequestHandler } from "@remix-run/express";
import type { ServerBuild } from "@remix-run/node";

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? null
    : await import("vite").then((vite) =>
        vite.createServer({ server: { middlewareMode: true } }),
      );

const app = express();

app.use(
  viteDevServer ? viteDevServer.middlewares : express.static("build/client"),
);

const build: ServerBuild | (() => Promise<ServerBuild>) = viteDevServer
  ? async () =>
      viteDevServer!.ssrLoadModule(
        "virtual:remix/server-build",
      ) as Promise<ServerBuild>
  : ((await import(
      new URL("./server/index.js", import.meta.url).href
    )) as ServerBuild);

app.all("*", createRequestHandler({ build }));

app.listen(3000, () => {
  console.log("App listening on http://localhost:3000");
});
