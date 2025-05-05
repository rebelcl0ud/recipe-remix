// import express from "express";
// import { createRequestHandler } from "@remix-run/express";
// import type { ServerBuild } from "@remix-run/node";

// const viteDevServer =
//   process.env.NODE_ENV === "production"
//     ? null
//     : await import("vite").then((vite) =>
//         vite.createServer({
//           server: { middlewareMode: true },
//         })
//       );

// const app = express();

// app.use(
//   viteDevServer ? viteDevServer.middlewares : express.static("build/client")
// );

// const build: ServerBuild | (() => Promise<ServerBuild>) = viteDevServer
//   ? () =>
//       viteDevServer.ssrLoadModule(
//         "virtual:remix/server-build"
//       ) as Promise<ServerBuild>
//   : ((await import("./build/server/index.js")) as ServerBuild);

// // and your app is "just a request handler"
// app.all("*", createRequestHandler({ build }));

// app.listen(3000, () => {
//   console.log("App listening on http://localhost:3000");
// });

import express from "express";
import { createRequestHandler } from "@remix-run/express";
import type { ServerBuild } from "@remix-run/node";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isProd = process.env.NODE_ENV === "production";

const viteDevServer = isProd
  ? null
  : await import("vite").then((vite) =>
      vite.createServer({
        root: process.cwd(),
        server: { middlewareMode: true },
      })
    );

const app = express();

if (viteDevServer) {
  // Development: Vite handles assets
  app.use(viteDevServer.middlewares);
} else {
  // Production: Serve static client assets
  app.use(
    "/build",
    express.static(path.join(__dirname, "build", "client"), {
      immutable: true,
      maxAge: "1y",
    })
  );
  app.use(
    "/",
    express.static(path.join(__dirname, "build", "client"), { maxAge: "1h" })
  );
}

// Build handler (async in dev, static in prod)
const build: ServerBuild | (() => Promise<ServerBuild>) = viteDevServer
  ? async () =>
      viteDevServer.ssrLoadModule(
        "virtual:remix/server-build"
      ) as Promise<ServerBuild>
  : ((await import("./build/server/index.js")) as ServerBuild);

app.all(
  "*",
  createRequestHandler({
    build,
    mode: isProd ? "production" : "development",
  })
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Remix app listening on http://localhost:${port}`);
});
