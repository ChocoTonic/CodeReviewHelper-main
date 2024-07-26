import type { Context, Next } from "hono";
import logger from "./logger";
import { logger as HonoLogger } from "hono/logger";

declare module "hono" {
	interface Context {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		stdOk: (data: any) => any;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		stdErr: (status: number, data: any) => any;
	}
}

/**
 * Middleware function that adds standard response handling methods to the Hono context.
 *
 * The `stdOk` method can be used to return a successful JSON response with a timestamp, success flag, and the provided data.
 * The `stdErr` method can be used to return an error JSON response with a timestamp, success flag, and the provided error data.
 *
 * This middleware should be added to the Hono app to make these methods available in all route handlers.
 */
export function standardResponseMiddleware() {
	return async (ctx: Context, next: Next) => {
		ctx.stdOk = (data) => {
			return ctx.json({
				timestamp: new Date().toISOString(),
				success: true,
				data,
			});
		};
		ctx.stdErr = (status, data) => {
			return ctx.json(
				{
					timestamp: new Date().toISOString(),
					success: false,
					error: data,
				},
				status as unknown as any,
			);
		};
		await next();
	};
}

/**
 * Middleware function that logs messages using the configured logger.
 *
 * This middleware can be added to the Hono app to log all incoming requests and responses.
 */
export function loggerMiddleware() {
	return HonoLogger((message: string, ...rest: string[]) => {
		logger.info(message, ...rest);
	});
}
