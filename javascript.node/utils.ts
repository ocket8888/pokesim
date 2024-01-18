import { stdin, stdout } from "process";
import { Status, type Color } from "./constants";
import { type Interface, createInterface } from "readline/promises";
import type { Pokemon } from "./pokemon";

// Background color ANSI sequences
const RED_BACKGROUND = "\x1b[48;2;255;0;0m";
const GREEN_BACKGROUND = "\x1b[48;2;0;160;0m";

// Foreground Color ANSI sequenses
const WHITE_FOREGROUND = "\x1b[38;2;255;255;255m";

// Resets fore and background colors to their native settings (also restores cursor position)
const NATIVE = "\x1b[m";

/**
 * Gets the size of the terminal window.
 *
 * @returns The number columns and lines that together denote the size of the
 * terminal window.
 */
function getTTYsize(): [number, number] {
	return [stdout.columns, stdout.rows];
}

/**
 * Creates a string representing a single health bar.
 *
 * @param width The width to use for displaying the entire bar.
 * @param hp The Pokémon's current HP.
 * @param maxHP The Pokémon's maximum possible HP.
 * @returns A string of characters and ANSI commands which, when printed, will
 * display as a health bar.
 */
export function healthBar(width: number, hp: number, maxHP: number): string {
	let hpBlocks = Math.floor(hp/maxHP * width);
	if (hpBlocks < 1 && hp > 0) {
		hpBlocks = 1;
	}

	const ret = [WHITE_FOREGROUND];
	if (hpBlocks > 0) {
		ret.push(GREEN_BACKGROUND);
	}

	const hpText = `${String(hp).padStart(4, " ")}/${maxHP}`;
	for (let i = 0; i < hpText.length; ++i) {
		if (i === hpBlocks) {
			ret.push(RED_BACKGROUND);
		}
		ret.push(hpText[i]);
	}

	if (hpBlocks < 9) {
		ret.push(" ".repeat(width-9))
	} else {
		ret.push(" ".repeat(hpBlocks - 9));
		ret.push(RED_BACKGROUND);
		ret.push(" ".repeat(width - hpBlocks));
	}

	ret.push(NATIVE)

	return ret.join("");
}

/**
 * Prints both Pokémon's health bars, along with relevant status information.
 *
 * @param userPokemon The user's Pokémon.
 * @param opponentPokemon The opponent's/computer's Pokémon.
 */
export function printHealthBars(userPokemon: Pokemon, opponentPokemon: Pokemon): void {
	const cols = getTTYsize()[0];
	const sepPos = Math.floor(cols/2) - 1;
	const opponentSpace = cols - (Math.floor(cols/2) - 1);

	// Pokémon names
	console.log(String(userPokemon).padEnd(sepPos - 2), String(opponentPokemon).padEnd(opponentSpace - 1));

	// Pokémon level and status
	let str = `Lv. ${String(userPokemon.level).padStart(3)}`;
	if (userPokemon.status !== Status.none) {
		str += ` ${userPokemon.status}`;
	} else {
		str += "   ";
	}
	str += " ".repeat(sepPos - 11);
	str += `Lv. ${String(opponentPokemon.level).padStart(3)}`;
	if (opponentPokemon.status !== Status.none) {
		str += ` ${opponentPokemon.status}`;
	}
	console.log(str);

	console.log(healthBar(sepPos-1, userPokemon.hp, userPokemon.maxHP), healthBar(opponentSpace, opponentPokemon.hp, opponentPokemon.maxHP));
}


/**
 * Returns a string that will print in the specified color, by wrapping it in
 * ANSI control codes.
 *
 * @param text The actual text to print.
 * @param color The color in which printing is desired.
 */
export function colorSprintf(text: string, color: Color): string {
	return `\x1b[38;2;${color[0]};${color[1]};${color[2]}m${text}\x1b[m`;
}

/**
 * Returns a string that will print with the given background (and optionally
 * foreground) color(s).
 *
 * @param text The actual text to print.
 * @param bgcolor The color for the background of the text.
 * @param fgcolor The color for the foreground of the text.
 */
export function colorSprintfBckgrnd(text: string, bgcolor: Color, fgcolor: Color=[255, 255, 255]): string {
	return `\x1b[48;2;${bgcolor[0]};${bgcolor[1]};${bgcolor[2]}m\x1b[38;2;${fgcolor[0]};${fgcolor[1]};${fgcolor[2]}m${text}\x1b[m`;
}

/**
 * Clears the terminal screen. It's not portable to terminals that don't
 * recognize ANSI control codes (e.g. on DOS), but there's no other efficient
 * way afaik.
 */
export function cls(): void {
	console.log("\x1b[H\x1b[J");
}

let input: Interface | null = null;
/**
 * Sets up tab-completion for the 'fullWords' set.
 */
export function setCompleter(fullWords: string[]): Interface {
	/**
	 * A closure that is used as the readline completion function.
	 */
	function complete(text: string): [string[], string] {
		return [fullWords.filter(word => word.startsWith(text)), text];
	}

	if (input) {
		input.close();
	}
	input = createInterface({completer: complete, input: stdin, output: stdout});
	// TODO: these aren't currently implemented by NodeJS (I think?) so I'm not
	// sure how I'd go about adding them without a third party library.
	// readline.set_completer_delims(' \t\n:')
	// readline.parse_and_bind("tab: complete")
	return input;
}

/**
 * Creates an Array of integers in some range beginning at zero.
 *
 * @example
 * // The set of all integers
 * const integers = range(Infinity);
 *
 * @param end The end of the range (exclusive).
 * @yields The integers from 0 to `end`.
 */
export function range(end: number): Generator<number>;
/**
 * Creates an Array of integers in some range.
 *
 * @example
 * // The set of all integers that are at least -10.
 * const integers = range(-10, Infinity);
 *
 * @param start The start of the range (inclusive). Starting at Infinity or
 * negative Infinity is illegal.
 * @param end The end of the range (exclusive).
 * @yields The integers from `start` to `end`.
 */
export function range(start: number, end: number): Generator<number>;
/**
 * Creates an Array of integers in some range, incrementing by the given amount.
 *
 * @example
 * // The set of all even integers
 * const integers = range(0, Infinity, 2);
 *
 * @param start The start of the range (inclusive).
 * @param end The end of the range (exclusive).
 * @param step The distance between each successive value as the range is
 * traversed.
 * @yields The integers from `start` to `end`, changing by `step` each time.
 */
export function range(start: number, end: number, step: number): Generator<number>;
/**
 * Creates an Array of integers in some range, with some step.
 *
 * @example
 * // The set of all even integers
 * const integers = range(0, Infinity, 2);
 *
 * @param startOrEnd If no other arguments are present, this is the end of the
 * range (exclusive). Otherwise, it's the start of the range (inclusive).
 * Starting at positive or negative Infinity is illegal.
 * @param end The end of the range (exclusive).
 * @param step The distance between each successive value as the range is
 * traversed.
 * @yields The integers from `start` to `end`, changing by `step` each time.
 */
export function* range(startOrEnd: number, end?: number, step?: number): Generator<number> {
	if (Number.isNaN(startOrEnd) || Number.isNaN(end) || Number.isNaN(step)) {
		throw new Error("no argument to 'range' may be NaN");
	}

	step = step ?? 1;
	let start;
	if (end === undefined) {
		end = startOrEnd;
		start = 0;
	} else {
		start = startOrEnd;
	}

	if (!Number.isInteger(start) || (!Number.isInteger(end) && Number.isFinite(end)) || !Number.isInteger(step)) {
		throw new Error("all arguments to 'range' must be integers, and step and start must be finite");
	}

	let val = start;
	const condition: (s: number, e: number, v: number) => boolean = start < end ? ((s, e, v) => v < e && v >= s) : ((s, e, v) => v < s && v >= e);
	while (condition(start, end, val)) {
		yield val;
		val += step;
	}
}
