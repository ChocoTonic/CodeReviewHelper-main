import type { z } from "zod";
import { zValidator } from "@hono/zod-validator";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type ZodSchemaType = z.ZodType<any, any, any>;

/**
 * Validates the request body using the provided Zod schema.
 *
 * @param zodSchema - The Zod schema to use for validation.
 * @returns A middleware function that validates the request body and returns a 400 error if the validation fails.
 */
export function validBody(zodSchema: ZodSchemaType) {
	return zValidator("json", zodSchema, (result, c) => {
		if (!result.success) {
			return c.stdErr(400, result.error);
		}
	});
}

/**
 * Validates the request query parameters using the provided Zod schema.
 *
 * @param zodSchema - The Zod schema to use for validation.
 * @returns A middleware function that validates the request query parameters and returns a 400 error if the validation fails.
 */
export function validQuery(zodSchema: ZodSchemaType) {
	return zValidator("query", zodSchema, (result, c) => {
		if (!result.success) {
			return c.stdErr(400, result.error);
		}
	});
}
