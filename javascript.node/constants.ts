import { stdout } from "process";
import { colorSprintfBckgrnd } from "./utils";
import { parseIntegerList } from "./ioutils";

/**
 * The directory in which game data can be found.
 */
export const DATA_DIR = "../data";

/**
 * A displayable color.
 */
export type Color = [number, number, number];


/**
 * A Pokémon's stats, enumerated for ease-of-use.
 */
export const enum Stat {
	/** The amount of damage a Pokémon can take before fainting. */
	Hitpoints = 0,
	/** Affects damage inflicted by a Pokémon's physical attacks. */
	Attack = 1,
	/** Affects the damage taken by a Pokémon from physical attacks. */
	Defense = 2,
	/** Affects damage inflicted by a Pokémon's "special" attacks. */
	Special_Attack = 3,
	/** Affects the damage taken by a Pokémon from "special" attacks. */
	Special_Defense = 4,
	/**
	 * Affects whether a Pokémon's attacks happen before or after other
	 * Pokémon's.
	 */
	Speed = 5,
	/**
	 * Affects the likelihood of critical hits.
	 */
	Critical_Ratio = 6,
	/** Affects the probability that an attack will land. */
	Accuracy = 7,
	/** Affects the probability that a Pokémon will dodge an attack. */
	Evasiveness = 8,
	/** Unknown. */
	CRIT
}

/**
 * A stat that can be affected by stat-affecting Moves.
 */
export type StageableStat = Exclude<Stat, Stat.CRIT | Stat.Hitpoints>;

/**
 * A stat that is affected by effort values.
 */
export type EVStat = Exclude<Stat, Stat.Accuracy | Stat.CRIT | Stat.Critical_Ratio | Stat.Evasiveness>;

/**
 * Returns the name of a stat.
 */
export function statName(stat: Stat): string {
	switch (stat) {
		case Stat.Hitpoints:
			return "Hitpoints"
		case Stat.Attack:
			return "Attack"
		case Stat.Defense:
			return "Defense"
		case Stat.Special_Attack:
			return "Special Attack"
		case Stat.Special_Defense:
			return "Special Defense"
		case Stat.Speed:
			return "Speed"
		case Stat.Critical_Ratio:
			return "Critical_Ratio"
		case Stat.Accuracy:
			return "Accuracy"
		case Stat.Evasiveness:
			return "Evasiveness"
		default:
			return "";
	}
}

/**
 * Selects stat change flavor text. Is not really a constant, but neither is it
 * really a utility. I expect a good place for this will become apparent as more
 * functionality is added, but for now it'll sit here.
 */
export function statChangeFlavorText(amt: number): string {
	if (amt >= 3) {
		return "rose drastically!"
	} else if (amt === 2) {
		return "rose sharply!"
	} else if (amt === 1) {
		return "rose!"
	} else if (amt === -1) {
		return "fell!"
	} else if (amt === -2) {
		return "harshly fell!"
	} else if (amt <= -3) {
		return "severely fell!"
	}

	// idk how else to handle this
	return "didn't change!"
}

/**
 * Attempts to construct a Stat from a raw number.
 *
 * @param input The number to be parsed. This should be equivalent to the enum
 * member of the Stat it represents.
 * @returns The Stat represented.
 * @throws {Error} if the given raw Stat cannot be parsed, and/or parses to
 * an integer that doesn't represent a Stat.
 */
export function parseStat(input: number): Stat {
	switch(input) {
		case Stat.Hitpoints:
		case Stat.Attack:
		case Stat.Defense:
		case Stat.Special_Attack:
		case Stat.Special_Defense:
		case Stat.Speed:
		case Stat.Critical_Ratio:
		case Stat.Accuracy:
		case Stat.Evasiveness:
			return input;
	}

	throw new Error(`unrecognized internal Stat representation: ${input}`);
}

/**
 * Parses a list of Stats from a string space-separated numbers.
 *
 * @param stats The Stat list to attempt to parse. This accepts `undefined` so
 * that data file lines can be fed in directly.
 * @returns The stat array represented by the string `stats`.
 * @throws {Error} if `stats` cannot be parsed.
 */
export function parseStatList(stats: string | undefined): number[] {
	const ints = parseIntegerList(stats);

	const ret = [];
	for (let i = 0; i < ints.length; ++i) {
		try {
			ret.push(parseStat(ints[i]));
		} catch (e) {
			throw new Error(`stat array position #${i+1}: ${e instanceof Error ? e.message : e}`);
		}
	}

	return ret;
}

/**
 * A Pokémon's status, enumerated for ease-of-use.
 */
export const enum Status {
	/** Unaffected by any Status. */
	none      = 0,
	/** Speed is lowered and may be unable to act. */
	Paralyzed = 1,
	/** Taking periodic damage. */
	Poisoned  = 2,
	/** Attack is lowered, and taking periodic damage. */
	Burned    = 3,
	/** Unable to act. */
	Asleep    = 4,
	/** Unable to act. */
	Frozen    = 5
}

/**
 * A mapping of a Status to its appropriate background color.
 */
export const statusColors: Record<Status, Color> = {
	[Status.Paralyzed]: [248, 208, 48],
	[Status.Poisoned]: [160, 64, 160],
	[Status.Burned]: [240, 128, 48],
	[Status.Asleep]: [140, 136, 140],
	[Status.Frozen]: [152, 216, 216],
	[Status.none]: [0,0,0]
};

/**
 * A mapping of a Status to its abbreviated name.
 */
export const statusAbbrev: Record<Status, string> = {
	[Status.Paralyzed]: "PAR",
	[Status.Poisoned]: "PSN",
	[Status.Burned]: "BRN",
	[Status.Asleep]: "SLP",
	[Status.Frozen]: "FRZ",
	[Status.none]: ""
}

/**
 * Gets the print-able name of the passed Status.
 *
 * @param status The status to be printed.
 */
export function printStatus(status: Status): string {
	if (status === Status.none) {
		return "";
	}

	const abbrev = statusAbbrev[status];
	if (stdout.isTTY) {
		return colorSprintfBckgrnd(abbrev, statusColors[status]);
	}
	return abbrev;
}
