import { type PathLike, promises as fs } from "fs";
import type { FileHandle } from "fs/promises";
import { Interface } from "readline/promises";

/**
 * Parses a boolean from a string containing a number.
 *
 * @param bool The boolean to attempt to parse. This accepts `undefined` so that
 * data file lines can be fed in directly.
 * @returns The boolean represented by the string `bool`.
 * @throws {Error} if `bool` cannot be parsed.
 */
export function parseBool(bool: string | undefined): boolean {
	const numeric = parseInteger(bool);
	if (numeric === 0 || numeric === 1) {
		return !!numeric;
	}
	throw new Error(`not a valid boolean representation: '${bool}'`);
}

/**
 * Parses an integer from a string containing a number.
 *
 * @param int The integer to attempt to parse. This accepts `undefined` so that
 * data file lines can be fed in directly.
 * @param nonNegative If given and `true`, negative integers parsed will throw
 * errors.
 * @returns The integer represented by the string `int`.
 * @throws {Error} if `int` cannot be parsed.
 */
export function parseInteger(int: string | undefined, nonNegative: boolean = false): number {
	if (!int) {
		throw new Error("missing or empty");
	}
	const integer = Number.parseInt(int, 10);
	if (Number.isNaN(integer)) {
		throw new Error(`not a valid base-10 integer: ${int}`);
	}
	if (nonNegative && integer < 0) {
		throw new Error("must not be negative");
	}
	return integer;
}

/**
 * Parses a rational number from a string containing a number.
 *
 * @param float The floating point number to attempt to parse. This accepts
 * `undefined` so that data file lines can be fed in directly.
 * @param nonNegative If given and `true`, negative numbers parsed will throw
 * errors.
 * @returns The floating point number represented by the string `float`.
 * @throws {Error} if `float` cannot be parsed.
 */
export function parseRational(float: string | undefined, nonNegative: boolean = false): number {
	if (!float) {
		throw new Error("missing or empty");
	}
	const rational = parseFloat(float);
	if (Number.isNaN(rational)) {
		throw new Error(`not a valid base-10 rational number: ${float}`);
	}
	if (nonNegative && rational < 0) {
		throw new Error("must not be negative");
	}
	return rational;
}

/**
 * Parses a list of integers from a string space-separated numbers.
 *
 * @param ints The integer list to attempt to parse. This accepts `undefined` so
 * that data file lines can be fed in directly.
 * @param nonNegative If given and `true`, negative numbers parsed will throw
 * errors.
 * @returns The integer array represented by the string `ints`.
 * @throws {Error} if `ints` cannot be parsed.
 */
export function parseIntegerList(ints: string | undefined, nonNegative: boolean = false): number[] {
	if (!ints) {
		throw new Error("missing or empty");
	}

	const ret = [];
	const list = ints.trim().split(" ");
	for (let i = 0; i < list.length; ++i) {
		try {
			ret.push(parseInteger(list[i], nonNegative));
		} catch (e) {
			throw new Error(`integer array position #${i+1}: ${e instanceof Error ? e.message : e}`);
		}
	}

	return ret;
}

/**
 * Type guard for checking if something is "path-like".
 *
 * @param path The thing to check to see if it's a path-like thingy.
 */
export function isPath(path: unknown): path is PathLike {
	return typeof(path) === "string" || path instanceof Buffer || path instanceof URL;
}

/**
 * A convenience method for iterating lines of a file (asynchronously) that also
 * provides the line number.
 */
export async function* readLines(file: PathLike | FileHandle): AsyncGenerator<[string, number]> {
	if (isPath(file)) {
		file = await fs.open(file, undefined, "r");
	}

	let i = 1
	for await (const line of file.readLines()) {
		yield [line, i];
	}
}
