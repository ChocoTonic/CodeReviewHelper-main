import { Hono } from 'hono'
import {cors} from "hono/cors";
import {HTTPException} from "hono/http-exception";
import logger from "./lib/logger";
import {loggerMiddleware, standardResponseMiddleware} from "./lib/middleware";
import apiRoutes from "./routes/api";
import {serveStatic} from "hono/bun";

const PORT = process.env.PORT ? Number.parseInt(process.env.PORT) : 4040

const app = new Hono()

// middlewares
app.use("/api/*", cors({
  origin: "*",
}));
app.use("/api/*", loggerMiddleware());
app.use("/api/*", standardResponseMiddleware());

// api routes
app.route("/api", apiRoutes)

// error handler
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.stdErr(err.status, {
      status: err.status,
      message: err.message,
    });
  }
  logger.error({err}, "Internal Server Error");
  return c.stdErr(500, {
    status: 500,
    message: "Internal Server Error",
  });
});

const REGEX_STATIC_FILES = /\.(js|css|json|svg|png)$/i;
app.get('*', serveStatic({
  root: './web/dist/',
  rewriteRequestPath: (path) => {
    if (REGEX_STATIC_FILES.test(path)) {
      return path;
    }
    return '/index.html'
  },
}))

export default {
  port: PORT,
  fetch: app.fetch,
}
