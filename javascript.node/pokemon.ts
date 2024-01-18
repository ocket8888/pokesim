import { promises as fs } from "fs";
import { join as pathJoin } from "path";

import { DATA_DIR, type EVStat, type StageableStat, Stat, Status, statChangeFlavorText, printStatus, parseStat, statName } from "./constants";
import { Type, parseType, printType, typeNames } from "./poketypes";
import { Move, MoveKind } from "./move";
import { parseBool, parseInteger, parseRational } from "./ioutils";
import { NATURES, natureStatMultiplier, printNatures } from "./nature";
import { calculateDamage } from "./damage";
import { cls, range, setCompleter } from "./utils";

const suffixes = {
	0: "st",
	1: "nd",
	2: "rd",
	3: "th"
};

/**
 * A set of Moves available to a Pokémon.
 */
export type MoveSet = [Move, Move, Move, Move];

/**
 * A class representing a pokemon, and all the information that entails.
 */
export class Pokemon {

	private nickname: string | null;

	public get name(): string {
		return this.nickname ?? this.species;
	}

	public accuracy = 100;
	public evasiveness = 100;
	public status = Status.none;
	public priority = 0;
	public stages: Record<StageableStat, number> = {
		[Stat.Attack]: 0,
		[Stat.Defense]: 0,
		[Stat.Special_Attack]: 0,
		[Stat.Special_Defense]: 0,
		[Stat.Speed]: 0,
		[Stat.Critical_Ratio]: 0,
		[Stat.Accuracy]: 0,
		[Stat.Evasiveness]: 0
	}

	public EVs: Record<EVStat, number> = {
		[Stat.Attack]: 0,
		[Stat.Defense]: 0,
		[Stat.Special_Attack]: 0,
		[Stat.Special_Defense]: 0,
		[Stat.Speed]: 0,
		[Stat.Hitpoints]: 0,
	};

	public level = 0;
	public nature: keyof typeof NATURES | null = null;
	public type1 = Type.Typeless;
	public type2 = Type.Typeless;
	public gendered = false;
	public ability = "";

	public height = 0;
	public weight = 0;

	public attack = 0;
	public defense = 0;
	public specialAttack = 0;
	public specialDefense = 0;
	public speed = 0;
	public maxHP = 0;
	public hp = 0;

	public availableAbilities = new Array<string>();
	public availableMoves = new Array<[string, number]>();
	public moves: MoveSet = [new Move(""), new Move(""), new Move(""), new Move("")];

	#gender: "m" | "f" = "m";
	public get gender(): string {
		if (!this.gendered) {
			return "Genderless";
		}
		return this.#gender === "m" ? "Male" : "Female";
	}
	public set gender(gender: string) {
		if (!this.gendered) {
			return;
		}
		switch (gender.trim().toLowerCase()) {
			case "m":
			case "male":
			case "b":
			case "boy":
			case "man":
			case "masculine":
				this.#gender = "m";
				break;
			case "f":
			case "female":
			case "g":
			case "girl":
			case "woman":
			case "feminine":
				this.#gender = "f";
				break;
			default:
				throw new Error(`invalid gender representation: '${gender}'`);
		}
	}

	public get shadow(): boolean {
		return this.type1 === Type.Shadow || this.type2 === Type.Shadow;
	}

	constructor(public readonly species: string, name?: string) {
		if (name) {
			this.nickname = name;
		} else {
			this.nickname = null;
		}
	}

	/**
	 * Reads in the base data for the Pokémon from its species' data file.
	 */
	public async readData(): Promise<void> {
		const filename = pathJoin(DATA_DIR, "pokemon", this.species);
		const lines = (await fs.readFile(filename, {encoding: "utf-8"})).split("\n");

		let i = 0;
		function nextLine(): string | undefined {
			++i;
			return lines.shift();
		}
		try {
			this.type1 = parseType(parseInteger(nextLine()));
			this.type2 = parseType(parseInteger(nextLine()));
			this.gendered = parseBool(nextLine());
			this.height = parseRational(nextLine(), true);
			this.weight = parseRational(nextLine(), true);
			this.maxHP = parseInteger(nextLine(), true);
			this.hp = this.maxHP;
			this.attack = parseInteger(nextLine(), true);
			this.defense = parseInteger(nextLine(), true);
			this.specialAttack = parseInteger(nextLine(), true);
			this.specialDefense = parseInteger(nextLine(), true);
			this.speed = parseInteger(nextLine(), true);

			const abilities = nextLine();
			if (!abilities) {
				throw new Error("missing or empty");
			}
			this.availableAbilities = abilities.split(" ");

			while (true) {
				const line = nextLine();
				if (!line) {
					break;
				}
				const parts = line.split(" ");
				const rLevel = parts.pop();
				this.availableMoves.push([parts.join(" "), parseInteger(rLevel, true)]);
			}
		} catch (e) {
			throw new Error(`line #${i} of ${filename}: ${e instanceof Error ? e.message : e}`);
		}
	}

	/**
	 * Sets a Pokémon's stats based on its nature, EVs and base stats (assumes
	 * perfect IVs).
	 * This shouldn't be called until after `readData` is called and the
	 * resultant Promise resolves!
	 */
	public setStats(): void {
		const mults = natureStatMultiplier(this.nature);

		this.maxHP = (2 * this.maxHP) + 31 + Math.floor( this.EVs[0] / 4.0 );
		this.maxHP = Math.floor(this.maxHP * this.level / 100.0);
		this.maxHP = this.maxHP + this.level + 10;
		this.hp = this.maxHP;

		this.attack = (2 * this.attack) + 31 + Math.floor( this.EVs[1] / 4.0 );
		this.attack = Math.floor(this.attack * this.level / 100.0);
		this.attack += 5;
		this.attack = Math.floor(this.attack * mults[Stat.Attack]);

		this.defense = (2.0 * this.defense) + 31 + Math.floor( this.EVs[2] / 4.0 );
		this.defense = Math.floor(this.defense * this.level / 100.0);
		this.defense += 5;
		this.defense = Math.floor(this.defense * mults[Stat.Defense]);

		this.specialAttack = (2.0 * this.specialAttack) + 31 + Math.floor( this.EVs[3] / 4.0 );
		this.specialAttack = Math.floor(this.specialAttack * this.level / 100.0);
		this.specialAttack += 5;
		this.specialAttack = Math.floor(this.specialAttack * mults[Stat.Special_Attack]);

		this.specialDefense = (2.0 * this.specialDefense) + 31 + Math.floor( this.EVs[4] / 4.0 );
		this.specialDefense = Math.floor(this.specialDefense * this.level / 100.0);
		this.specialDefense += 5;
		this.specialDefense = Math.floor(this.specialDefense * mults[Stat.Special_Defense]);

		this.speed = (2.0 * this.speed) + 31 + Math.floor( this.EVs[5] / 4.0 );
		this.speed = Math.floor(this.speed * this.level / 100.0);
		this.speed += 5;
		this.speed = Math.floor(this.speed * mults[Stat.Speed]);
	}

	/**
	 * An interactive routine to set the Pokémon's `moveNo`th move.
	 *
	 * @param moveNo The number of the move to be set.
	 */
	public async setMove(moveNo: 0 | 1 | 2 | 3): Promise<void> {
		const knownMoves = new Set(this.moves.filter((m, i) => m.name && i !== moveNo).map(m => m.name));
		const available = new Set(this.availableMoves.filter(m => m[1] <= this.level && !knownMoves.has(m[0])).map(m => m[0]));

		const input = setCompleter(Array.from(available));
		while (true) {
			console.log(`Select ${this}'s ${moveNo+1}${suffixes[moveNo]} move.`);
			const choice = await input.question("(move, or type 'l' to list available moves) [Debug Moveset]:");
			if (!choice) {
				const m = new Move(['Growl', 'Sweet Scent', 'Razor Leaf', 'Vine Whip'][moveNo]);
				this.moves[moveNo] = m;
				await m.readData();
				break;
			}
			if (choice === "l") {
				cls();
				for (const availableMove of available) {
					console.log(availableMove);
				}
				console.log();
				continue;
			}
			if (available.has(choice)) {
				this.moves[moveNo] = new Move(choice);
				await this.moves[moveNo].readData();
				break;
			}
			if (choice && knownMoves.has(choice)) {
				cls();
				console.log(`${this} already knows ${choice}!`);
			} else {
				cls();
				console.log(`Unrecognized move: '${choice}'`);
			}
		}
	}

	/**
	 * Changes a Pokémon's stat stage by the given amount.
	 *
	 * @param stat The stat to change.
	 * @param amt The amount by which to change it.
	 * @returns A string describing what took place.
	 */
	public changeStage(stat: StageableStat, amt: number): string {
		if (amt > 0 && this.stages[stat] >= 6) {
			this.stages[stat] = 6;
			return `${this}'s ${stat} won't go any higher!`;
		}
		if (amt < 0 && this.stages[stat] <= -6) {
			this.stages[stat] = -6;
			return `${this}'s ${stat} won't go any lower!`;
		}

		this.stages[stat] = (this.stages[stat] + amt );
		if (this.stages[stat] > 6) {
			this.stages[stat] = 6;
		} else if (this.stages[stat] < -6) {
			this.stages[stat] = -6;
		}

		return `${this}'s ${statName(stat)} ${statChangeFlavorText(amt)}`;
	}

	/**
	 * Handles what happens when a Pokémon uses a move on another Pokémon. Note
	 * that this doesn't check if the move can actually be used due to PP or
	 * disability etc.
	 *
	 * @param myMove The move being used by this Pokémon.
	 * @param otherPoke The target Pokémon.
	 * @param otherMove The move being used by the other Pokémon.
	 * @returns a string describing the interaction.
	 */
	public useMove(myMove: Move, otherPoke: Pokemon, otherMove: Move): string {
		myMove.PP -= 1;
		const hitChance = Math.floor(Math.random()*101);
		let effAcc = 100.0;
		if (this.stages[Stat.Accuracy] > 0) {
			effAcc *= ( 3 + this.stages[Stat.Accuracy] ) / 3.0;
		} else if (this.stages[Stat.Accuracy] < 0) {
			effAcc *= 3.0 / ( 3 + this.stages[Stat.Accuracy] );
		}

		let effEv = 100.0;
		if (otherPoke.stages[Stat.Evasiveness] > 0) {
			effEv *= ( 3 + otherPoke.stages[Stat.Evasiveness] ) / 3.0;
		} else if (otherPoke.stages[Stat.Evasiveness] < 0) {
			effEv *= 3.0 / ( 3 - otherPoke.stages[Stat.Evasiveness] );
		}

		if (hitChance > Math.floor(myMove.accuracy * effAcc / effEv )) {
			return `... but it ${myMove.kind !== MoveKind.Status ? "missed" : "failed"}!`;
		}

		// Some damaging move, either physical or special
		if (myMove.kind !== MoveKind.Status) {
			const [dmg, eventStr] = calculateDamage(this, myMove, otherPoke, otherMove);
			otherPoke.hp -= dmg;
			if (otherPoke.hp < 0) {
				otherPoke.hp = 0;
			}
			return `${eventStr}It dealt ${dmg} damage!`;
		}

		// Some status move
		const targetPoke = myMove.target ? this : otherPoke;
		return myMove.stageChanges.map(([stat, change]) => targetPoke.changeStage(stat, change)).join("\n");
	}

	/**
	 * Constructs a string representation of a Pokémon, meant to be viewed by
	 * developers.
	 */
	public debugString(): string {
		const printstr = [`Lv. ${String(this.level).padStart(3)} ${String(this).padEnd(22)}`];
		printstr.push(`Type: ${printType(this.type1).padStart(8)}${this.type2 === Type.Typeless ? " ".repeat(17) : `/${printType(this.type2).padEnd(17)}`}${" ".repeat(14)}`);
		printstr.push(`Height: ${this.height.toFixed(1).padStart(4)}m${" ".repeat(19)}`);
		printstr.push(`Weight: ${this.weight.toFixed(1).padStart(5)}kg${" ".repeat(17)}`);
		printstr.push(`Gender: ${this.gender.padEnd(24)}`);
		printstr.push(`Nature: ${(this.nature ? this.nature : "unset").padEnd(24)}`);
		printstr.push(`Status: ${(this.status !== Status.none ? printStatus(this.status) : "Healthy").padEnd(24)}`);
		printstr.push(`MaxHP/CurrentHP: ${String(this.hp).padStart(4)}/${String(this.maxHP).padEnd(4)}      `);
		printstr.push(`Attack: ${String(this.attack).padStart(3)} (Stage: ${String(this.stages[Stat.Attack]).padStart(2, "+")})${" ".repeat(9)}`);
		printstr.push(`Defense: ${String(this.defense).padStart(3)} (Stage: ${String(this.stages[Stat.Defense]).padStart(2, "+")})${" ".repeat(8)}`);
		printstr.push(`Special Attack: ${String(this.specialAttack).padStart(3)} (Stage: ${String(this.stages[Stat.Special_Attack]).padStart(2, "+")}) `);
		printstr.push(`Special Defense: ${String(this.specialDefense).padStart(3)} (Stage: ${String(this.stages[Stat.Special_Defense]).padStart(2, "+")})`);
		printstr.push(`Speed: ${String(this.speed).padStart(3)} (Stage: ${String(this.stages[Stat.Speed]).padStart(2, "+")})${" ".repeat(10)}`);
		printstr.push(`Crit Stage: ${String(this.stages[Stat.Critical_Ratio]).padStart(2, "+")}${" ".repeat(18)}`);
		printstr.push(`Accuracy Stage: ${String(this.stages[Stat.Accuracy]).padStart(2, "+")}${" ".repeat(14)}`);
		printstr.push(`Evasiveness Stage: ${String(this.stages[Stat.Evasiveness]).padStart(2, "+")}${" ".repeat(11)}`);
		printstr.push("        Moves" + " ".repeat(19));
		printstr.push("=====================" + " ".repeat(11));
		for (const move of this.moves) {
			if (move.name) {
				printstr.push(`  ${String(move).padEnd(30)}`);
			}
		}

		return printstr.join("\n");
	}

	/**
	 * Returns the name of a pokemon, ready for printing
	 */
	public toString(): string {
		return this.name;
	}
}

/**
 * An interactive procedure to set the EVs of a given Pokémon.
 */
export async function setEVs(pokemon: Pokemon): Promise<void> {
	let total = 510
	const input = setCompleter(["0", "1", "2", "3", "4", "5"]);

	const choices: [string, EVStat][] = [
		["HP", Stat.Hitpoints],
		["Attack", Stat.Attack],
		["Defense", Stat.Defense],
		["Special Attack", Stat.Special_Attack],
		["Special Defense", Stat.Special_Defense],
		["Speed", Stat.Speed]
	];
	while (total > 0) {
		console.log(`Choose a stat to put Effort Values into (You have ${total} remaining EVs to spend)\n`);
		for (let i = 0; i < choices.length; ++i) {
			const choice = choices[i];
			console.log(`[${i}]: ${choice[0].padEnd(16)}-\t${pokemon.EVs[choice[1]]}`);
		}
		const choice = await input.question("[Default stats - 252 HP, 252 ATK, 6 DEF]:");
		let stat: EVStat;
		if (!choice) {
			pokemon.EVs = [252, 252, 6, 0, 0, 0];
			cls();
			break;
		}
		try {
			if (choice.length > 1) {
				throw new Error();
			}
			const chosenStat = Number.parseInt(choice, 10);
			if (!(chosenStat in choices)) {
				cls();
				console.log("Please choose one of the displayed numbers\n");
				continue;
			}
			stat = choices[chosenStat][1];
		} catch {
			cls();
			console.log("Please enter a number\n");
			continue;
		}

		console.log("\nNow enter the number of effort values to increase by (max for one stat is 252)");
		const amt = await input.question(":");
		const amount = Number.parseInt(amt, 10);
		if (Number.isNaN(amount)) {
			cls();
			console.log("Please enter a number\n");
			continue;
		}
		cls();
		if (amount + pokemon.EVs[stat] > 252) {
			console.log("Amount would overflow stat! (max 252)\n");
		} else if (amount + pokemon.EVs[stat] < 0) {
			console.log("Cannot have less than 0 EVs!\n");
		} else if (total - amount < 0) {
			console.log("You don't have that many EVs to spend!\n")
		} else {
			pokemon.EVs[stat] += amount
			total -= amount
		}
	}
}

/**
 * Interactively sets a Pokémon's gender.
 */
export async function setGender(pokemon: Pokemon): Promise<void> {
	if (!pokemon.gendered) {
		return;
	}

	const input = setCompleter(["Male", "Female", "male", "female", "boy", "girl", "masculine", "feminine"]);
	while (true) {
		console.log("Choose the Pokémon's gender");
		const choice = await input.question("(Male/Female) [Male]: ");
		if (!choice) {
			pokemon.gender = "Male";
			break;
		}
		try {
			pokemon.gender = choice;
			break;
		} catch (e) {
			cls();
			console.log(`This ain't Tumblr (${e instanceof Error ? e.message : e})`);
		}
	}
}

/**
 * Interactively sets a Pokémon's level.
 */
export async function setLevel(pokemon: Pokemon): Promise<void> {
	const choices = Array.from(range(1, 101));
	const input = setCompleter(choices.map(i => String(i)));
	while (true) {
		console.log("Choose the Pokémon's level");
		const choice = await input.question("(1-100) [100]: ");
		if (!choice) {
			pokemon.level = 100;
			return;
		}
		const lvl = Number.parseInt(choice);
		cls();
		if (Number.isNaN(lvl)) {
			console.log("Please enter a number.");
		} else if (lvl < 1 || lvl > 100) {
			console.log(`${lvl} is not a valid level!`);
		} else {
			pokemon.level = lvl;
			return;
		}
	}
}

/**
 * Interactively sets a Pokémon's Nature.
 *
 * @param pokemon The Pokémon to be affected.
 */
export async function setNature(pokemon: Pokemon): Promise<void> {
	const input = setCompleter(Object.keys(NATURES));
	while (!pokemon.nature) {
		console.log(`Choose ${pokemon}'s nature`);
		const choice = await input.question("(Nature, or 'l' to list natures) [Hardy]: ");
		cls();
		if (choice === 'l') {
			printNatures();
			console.log();
		} else if (!choice) {
			pokemon.nature = "Hardy";
		} else if (choice in NATURES) {
			pokemon.nature = choice;
		} else {
			console.log(`Not a nature: '${choice}'`);
		}
	}
}

/**
 * Decides which Pokémon attacks first.
 *
 * @param poke0 The first Pokémon (ostensibly the user's).
 * @param move0 The Move being used by `poke0`.
 * @param poke1 The second Pokémon (ostensibly the opponent's/computer's).
 * @param move1 The Move being used by `poke1`.
 * @returns `0` if `poke0` attacks first, `1` if `poke1` attacks first.
 */
export function decideOrder(poke0: Pokemon, move0: Move, poke1: Pokemon, move1: Move): 0 | 1 {
	if (move0.priority > move1.priority) {
		return 0;
	}
	if (move0.priority < move1.priority) {
		return 1;
	}

	// Priorities are the same, calculate effective speeds
	let [effsp0, effsp1] = [poke0.speed, poke1.speed];

	if (poke0.stages[Stat.Speed] > 0) {
		effsp0 *= (2 + poke0.stages[Stat.Speed])/2.0;
	} else if (poke0.stages[Stat.Speed] < 0) {
		effsp0 *= 2.0/(2.0 - poke0.stages[Stat.Speed]);
	}

	if (poke0.status === Status.Paralyzed) {
		effsp0 /= 2.0;
	}

	if (poke1.stages[Stat.Speed] > 0) {
		effsp1 *= (2 + poke1.stages[Stat.Speed])/2.0;
	} else if (poke1.stages[Stat.Speed] < 0) {
		effsp1 *= 2.0/(2.0 - poke1.stages[Stat.Speed]);
	}

	if (poke1.status === Status.Paralyzed) {
		effsp1 /= 2.0;
	}

	// Use effective speed to calculate order
	if (effsp0 > effsp1) {
		return 0;
	}
	if (effsp1 > effsp0) {
		return 1;
	}

	// use random number to break tie
	return Math.floor(Math.random()*2) as 0 | 1;
}

/**
 * Prints out two Pokémon, interleaving their information on each line.
 */
export function dumpPokemon(userPokemon: Pokemon, opponentPokemon: Pokemon): void {
	const userLines = userPokemon.debugString().split('\n');
	const opponentLines = opponentPokemon.debugString().split('\n');
	if (userLines.length !== opponentLines.length) {
		throw new Error("Pokémon information is different lengths");
	}
	console.log(userLines.shift(), "versus        ", opponentLines.shift());
	for (let i = 0; i < userLines.length; ++i) {
		console.log(`${userLines[i]}              ${opponentLines[i]}`);
	}
	console.log();
}


/**
 * Totally sets up a Pokémon, interactively.
 *
 * @param pokemon The Pokémon to be set up.
 * @returns The newly set-up Pokémon.
 */
export async function setupPokemon(pokemon: Pokemon): Promise<Pokemon> {
	setCompleter([]);
	await setGender(pokemon);
	cls();
	await setLevel(pokemon);
	cls();
	await setNature(pokemon);
	cls();
	await setEVs(pokemon);
	pokemon.setStats();

	for (const i of [0, 1, 2, 3] as const) {
		await pokemon.setMove(i);
		cls();
	}
	return pokemon;
}
