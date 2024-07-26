/**
 * A decorator that creates a singleton class from the decorated class.
 * The singleton instance is lazily initialized and returned on subsequent calls to the constructor.
 *
 * @param constructor The class to be decorated as a singleton.
 * @returns A new class that extends the original class and implements the singleton pattern.
 */
// biome-ignore lint: <explanation>
export function Singleton<T extends { new (...args: any[]): {} }>(
	// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
	constructor: T,
) {
	return class extends constructor {
		private static _instance: T;

		// biome-ignore lint: <explanation>
		constructor(...args: any[]) {
			// biome-ignore lint: <explanation>
			if ((constructor as any)._instance) {
				// biome-ignore lint: <explanation>
				return (constructor as any)._instance;
			}
			super(...args);
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			(constructor as any)._instance = this;
		}
	};
}
