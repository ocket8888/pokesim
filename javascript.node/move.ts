import { join as pathJoin } from "path";
import { promises as fs } from "fs";

import { DATA_DIR, type StageableStat, parseStatList } from "./constants";
import { Type, parseType, printType } from "./poketypes";
import { parseBool, parseInteger, parseIntegerList } from "./ioutils";

/**
 * Gets a multiplier for critical hitting.
 *
 * @param movecrit The used move's inherent critical hit ratio.
 * @param pokestage The critical hit ratio "stage" of the Pokémon using the
 * move.
 * @returns A multiplier to apply to damage based on whether or not the move
 * crits.
 */
export function critical(movecrit: number, pokestages: number): number {
	const effectivestage = movecrit + pokestages;

	if (effectivestage > 3) {
		return 1.5;
	}

	const ratio = 1.0 / (2 ** (4-effectivestage))

	if (ratio > Math.random()) {
		return 1.5
	}
	return 1
}

/** The "kind" of a Pokémon's Move. */
export const enum MoveKind {
	/** A move that doesn't deal direct damage. */
	Status   = 0,
	/**
	 * A directly damaging move that doesn't make contact. Uses Special Attack
	 * and Special Defense for damage calculation.
	 */
	Special  = 1,
	/**
	 * A directly damaging move that makes contact. Uses Attack and Defense for
	 * damage calculation.
	 */
	Physical = 2
};

/** A mapping of the "kinds" of Pokémon Moves to their names. */
export const moveKindName: Readonly<Record<MoveKind, string>> = {
	[MoveKind.Status]: "Status",
	[MoveKind.Special]: "Special",
	[MoveKind.Physical]: "Physical"
};

/**
 * Attempts to construct a MoveKind from a raw number.
 *
 * @param input The number to be parsed. This should be equivalent to the enum
 * member of the MoveKind it represents.
 * @returns The MoveKind represented.
 * @throws {Error} if the given raw MoveKind cannot be parsed, and/or parses to
 * an integer that doesn't represent a MoveKind.
 */
export function parseMoveKind(input: number): MoveKind {
	switch(input) {
		case MoveKind.Physical:
		case MoveKind.Special:
		case MoveKind.Status:
			return input;
	}

	throw new Error(`unrecognized internal MoveKind representation: ${input}`);
}

/**
 * A move that is or can be known by a Pokémon.
 */
export class Move {
	public priority = 0;

	public type1 = Type.Typeless;
	public type2 = Type.Typeless;
	public accuracy = 100;
	public PP = 0;
	public maxPP = 0;
	public kind = MoveKind.Status;
	/** @todo Redundant? */
	public contact = false;

	/**
	 * Whether or not the move is considered a "shadow" move for the purposes of
	 * type effectiveness.
	 */
	public get shadow(): boolean {
		return this.type1 === Type.Shadow || this.type2 === Type.Shadow;
	}

	// properties that only have meaning for damaging moves.
	public crit = 0;
	public power = 0;

	// properties that only have meaning for status moves (for now).
	public target = false;
	public stageChanges = new Array<[StageableStat, number]>();

	constructor(public readonly name: string) { }

	/**
	 * Reads in a move's data from the data directory under `moves/{{name}}`.
	 */
	public async readData(): Promise<void> {
		const filename = pathJoin(DATA_DIR, "moves", this.name);
		const lines = (await fs.readFile(filename, {encoding: "utf-8"})).split("\n");

		let i = 0;
		function nextLine(): string | undefined {
			++i;
			return lines.shift();
		}
		try {
			this.type1 = parseType(parseInteger(nextLine()));
			this.type2 = parseType(parseInteger(nextLine()));
			this.contact = parseBool(nextLine());
			this.accuracy = parseInteger(nextLine(), true);
			this.PP = parseInteger(nextLine(), true);
			this.maxPP = this.PP;
			this.kind = parseMoveKind(parseInteger(nextLine()));

			if (this.kind !== MoveKind.Status) {
				this.power = parseInteger(nextLine(), true);
				this.crit = parseInteger(nextLine(), true);
			} else {
				const affectedStats = parseStatList(nextLine());
				const asl = affectedStats.length;

				const statChanges = parseIntegerList(nextLine());
				const scl = statChanges.length;
				if (asl !== scl) {
					throw new Error(`list of affected stats length (${asl}) does not match stat changes list length (${scl})`);
				}

				this.stageChanges = [];
				for (let sci = 0; sci < scl; ++sci) {
					this.stageChanges.push([affectedStats[sci], statChanges[sci]]);
				}

				this.target = parseBool(nextLine());
			}
		} catch (e) {
			throw new Error(`line #${i} of ${filename}: ${e instanceof Error ? e.message : e}`);
		}

	}

	/**
	 * Constructs a string representation of a Move meant to be viewed by
	 * developers.
	 */
	public debugStr(): string {
		let ret = [this, `Type: ${printType(this.type1)}`]
		if (this.type2 !== Type.Typeless) {
			ret[1] += `/${printType(this.type2)}`;
		}
		ret = ret.concat([moveKindName[this.kind], `Accuracy: ${this.accuracy}`]);
		if (this.kind !== MoveKind.Status) {
			ret = ret.concat([`Power: ${this.power}`, `Does ${this.contact ? "not make" : "make"} contact`]);
		}
		ret.push(`PP: ${this.PP}/${this.maxPP}`);
		return ret.join("\n");
	}

	/**
	 * Returns the human-readable name of a Move.
	 */
	public toString(): string {
		return this.name
	}
}
