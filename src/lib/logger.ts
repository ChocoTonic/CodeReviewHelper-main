import pino from "pino";

const LOG_LEVEL = process.env.LOG_LEVEL || "info";
const NODE_ENV = process.env.NODE_ENV || "development";

const logger = pino(NODE_ENV === "development" ? {
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
		},
	}
}: {});
logger.level = LOG_LEVEL;
logger.info(`Logger initialized with level ${logger.level}`);

export default logger;
