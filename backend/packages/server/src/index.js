const dotenv = require("dotenv");

dotenv.config();

const http = require("http");
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const logger = require("koa-logger");
const helmet = require("koa-helmet");
const cors = require("@koa/cors");
const router = require("./routes");
const socket = require("./socket");

const app = new Koa();

app.use(cors({ credentials: true }));
app.use(logger());
app.use(bodyParser());
app.use(helmet());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      message: err.message,
      data: err.data,
    };
  }
});

app.use(router.routes());

const server = http.createServer(app.callback());

const port = parseInt(process.env.PORT) || 5050;

server.listen(port, () =>
  console.log(`✅  The server is running at http://localhost:${port}/`)
);

socket(server);
