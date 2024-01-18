import * as process from "process";
import { promises as fs } from "fs";
import { join as pathJoin } from "path";

import { Pokemon, decideOrder, dumpPokemon, setupPokemon } from "./pokemon";
import { cls, printHealthBars, range, setCompleter } from "./utils";
import { Move } from "./move";
import { DATA_DIR } from "./constants";

/**
 * Gets a Pokémon from the user.
 *
 * @param available The names of the available Pokémon.
 * @param opponent If given and true, sets up the opposing/computer player's
 * Pokémon instead of the user's Pokémon.
 */
async function chooseAPokemon(available: Set<string>, opponent: boolean = false): Promise<Pokemon> {
	let input = setCompleter(Array.from(available));

	const choiceStr = `Choose ${opponent ? "your opponent's" : "a"} Pokémon`;
	let choice: string;
	while (true) {
		console.log(choiceStr);
		choice = await input.question("(Pokémon Name, or 'l' list available Pokémon) [Bulbasaur]: ");
		cls();

		if (choice === "l") {
			for (const availablePokemon of available) {
				console.log(availablePokemon);
			}
		} else if (available.has(choice)) {
			break;
		} else if (!choice) {
			choice = "Bulbasaur";
			break;
		} else {
			console.log(`'${choice}' is not a recognized Pokémon!`);
		}
	}

	let species = choice;
	let nickname = choice;

	input = setCompleter(["yes", "Yes", "no", "No"]);
	while (true) {
		choice = (await input.question("Nickname this Pokémon? [y/N]: ")).trim().toLowerCase();
		if (choice === "y" || choice === "yes") {
			while (true) {
				choice = await input.question("Enter nickname (max 48 characters):");
				if (choice) {
					if (choice.length <= 48) {
						nickname = choice;
						break;
					} else {
						console.log("Nickname too long!");
					}
				} else {
					console.log("Nickname cannot be blank!");
				}
			}
			break;
		}
		if (!choice || choice === "n" || choice === "N") {
			break;
		}
		console.log("Please enter 'y' or 'n' (or just hit 'Enter').");
	}

	const pokemon = new Pokemon(species, opponent ? "The opponent's " + nickname : nickname);
	await pokemon.readData();
	return setupPokemon(pokemon);
}

/**
 * Gets a move choice from the user.
 *
 * @param poke The user's Pokémon.
 * @param opponent The opponent's Pokémon.
 * @returns The user's selected Move.
 */
async function chooseAMove(poke: Pokemon, opponent: Pokemon): Promise<Move> {
	const choices = Array.from(range(1, 6));
	const input = setCompleter(choices.map(c => String(c)));
	let move: Move;
	while (true) {
		printHealthBars(poke, opponent);
		console.log("Choose a move:");
		for (let i = 0; i < poke.moves.length; ++i) {
			const move = poke.moves[i];
			console.log(`[${i+1}]: ${String(move).padEnd(30)}${String(move.PP).padStart(2)}/${String(move.maxPP).padEnd(2)}`);
		}
		console.log("[5] Print Pokémon for debugging");
		const choice = Number.parseInt(await input.question("(1-5): "));
		if (Number.isNaN(choice)) {
			cls();
			console.log("Please enter a number.\n");
		} else {
			if (Number.isInteger(choice) && choice > 0 && choice < 5) {
				move = poke.moves[choice - 1];
				if (move.PP > 0) {
					break;
				}
				cls();
				console.log("Out of PP!");
			} else if (choice == 5) {
				dumpPokemon(poke, opponent)
			} else {
				cls();
				console.log("Please enter a number from 1 to 5\n");
			}
		}
	}

	return move;
}


/**
 * Runs the main simulator.
 *
 * @returns An exit code.
 */
async function main(): Promise<number> {
	const availablePokemon = new Set(await fs.readdir(pathJoin(DATA_DIR, "pokemon")));
	cls();

	console.log("Welcome to the Pokémon Battle Simulator (written in TypeScript)!\n")

	const userPokemon = await chooseAPokemon(availablePokemon);

	cls();

	const opponentPokemon = await chooseAPokemon(availablePokemon, true);
	cls();

	console.log("Battle Starting!\n");
	dumpPokemon(userPokemon, opponentPokemon);

	let playerWon = true

	// Battle Loop
	while (true) {
		const input = setCompleter([]);
		await input.question("Press Enter to continue.");

		cls();

		// Player chooses a move
		const choice = await chooseAMove(userPokemon, opponentPokemon);
		const choiceStr = `${userPokemon} used ${choice}!`;

		// opponent chooses a move
		cls();
		const opponentChoice = opponentPokemon.moves[Math.floor(Math.random()*4)];
		const opponentChoiceStr = `${opponentPokemon} used ${opponentChoice}!`;

		const order = decideOrder(userPokemon, choice, opponentPokemon, choice);

		if (order === 1) {
			const opponentEvents = opponentPokemon.useMove(opponentChoice, userPokemon, choice);
			if (!userPokemon.hp || !opponentPokemon.hp) {
				printHealthBars(userPokemon, opponentPokemon);
				console.log(opponentChoiceStr);
				console.log(opponentEvents);
				playerWon = !opponentPokemon.hp
				break;
			}

			const userEvents = userPokemon.useMove(choice, opponentPokemon, opponentChoice);
			printHealthBars(userPokemon, opponentPokemon);
			console.log(opponentChoiceStr);
			console.log(opponentEvents);
			console.log(choiceStr);
			console.log(userEvents);
			if (!userPokemon.hp || !opponentPokemon.hp) {
				playerWon = !opponentPokemon.hp;
				break;
			}
		} else {
			const userEvents = userPokemon.useMove(choice, opponentPokemon, opponentChoice);
			if (!userPokemon.hp || !opponentPokemon.hp) {
				printHealthBars(userPokemon, opponentPokemon);
				console.log(choiceStr)
				console.log(userEvents);
				playerWon = !opponentPokemon.hp;
				break;
			}
			const opponentEvents = opponentPokemon.useMove(opponentChoice, userPokemon, choice);
			printHealthBars(userPokemon, opponentPokemon);
			console.log(choiceStr);
			console.log(userEvents);
			console.log(opponentChoiceStr);
			console.log(opponentEvents);
			if (!userPokemon.hp || !opponentPokemon.hp) {
				playerWon = !opponentPokemon.hp;
				break;
			}
		}
	}

	if (playerWon) {
		console.log(String(opponentPokemon), "fainted.");
		console.log("You Win!");
	} else {
		console.log(String(userPokemon), "fainted.");
		console.log("You lose...");
	}
	return 0;
}

main().then(c => process.exit(c));
