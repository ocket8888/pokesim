import { Stat, Status } from "./constants";
import { critical, MoveKind, type Move } from "./move";
import type { Pokemon } from "./pokemon";
import { TYPE_CHART, Type } from "./poketypes";

/**
 * Calculates the type effectiveness modifier of an attack.
 */
export function calcTypeEffectiveness(unused_attacker: Pokemon, defender: Pokemon, attack: Move): number {
	const [at1, at2] = [attack.type1, attack.type2];
	const [dt1, dt2] = [defender.type2, defender.type2];

	// Shadow moves have special rules, which I'll presumably use in the future
	if (attack.shadow) {
		return defender.shadow ? 0.5 : 2.0;
	}

	const mod = TYPE_CHART[at1][dt1] * TYPE_CHART[at1][dt2]

	return mod * TYPE_CHART[at2][dt1] * TYPE_CHART[at2][dt2]
}

/**
 * Calculates damage done by `pkmn` using `move` to `otherpkmn` (who used
 * `othermove`, if that matters).
 *
 * @param pkmn The attacking Pokémon.
 * @param move The move used by `pkmn`.
 * @param otherPkmn The opposing/target Pokémon.
 * @param unused_othermove The move used by the opposing/target Pokémon
 * (currently unused).
 * @returns The damage done and some flavor text to present to the user, as
 * a tuple.
 */
export function calculateDamage(pkmn: Pokemon, move: Move, otherPkmn: Pokemon, unused_othermove: Move): [number, string] {
	let dmg = 2 * pkmn.level / 5.0;
	dmg += 2;
	dmg *= move.power;

	let eventStr = "";

	const crit = critical(move.crit, pkmn.stages[Stat.Critical_Ratio]);
	if (crit > 1) {
		eventStr = "A critical hit!\n";
	}

	let effAt = 0.0;
	let effDef = 0.0;
	let atStage = null;
	let defStage = null;

	// Physical attack
	if (move.kind === MoveKind.Physical) {
		effAt = pkmn.attack;
		effDef = pkmn.defense;
		atStage = pkmn.stages[Stat.Attack];
		defStage = otherPkmn.stages[Stat.Defense];
	}
	// Special attack
	else {
		effAt = pkmn.specialAttack;
		effDef = pkmn.specialDefense;
		atStage = pkmn.stages[Stat.Special_Attack];
		defStage = otherPkmn.stages[Stat.Special_Defense];
	}

	if (atStage > 0) {
		effAt *= (2.0 + atStage) / 2.0;
	} else if (atStage < 0 && crit === 1) {
		effAt *= 2.0 / (2.0 - atStage);
	}

	if (defStage > 0 && crit === 1) {
		effDef *= (2.0 + defStage) / 2.0;
	} else if (defStage < 0) {
		effDef *= 2.0 / (2.0 - defStage);
	}


	dmg *= effAt/effDef
	dmg /= 50
	dmg += 2

	// Caclucate STAB modifier
	let mod = 0.85 + (0.15*Math.random());
	if (move.type1 !== Type.Typeless) {
		if (pkmn.type1 === move.type1 || pkmn.type2 === move.type1) {
			mod *= 1.5
		}
	}
	if (move.type2 !== Type.Typeless) {
		if (pkmn.type1 === move.type2 || pkmn.type2 === move.type2) {
			mod *= 1.5
		}
	}

	// Add in burn modification
	// TODO: add frostbite modification.
	if (pkmn.status === Status.Burned && move.kind === MoveKind.Physical) {
		mod /= 2.0;
	}

	// Add in type effectiveness modification.
	const typeMod = calcTypeEffectiveness(pkmn, otherPkmn, move);
	mod *= typeMod;

	if (typeMod <= 0) {
		eventStr += "But it had no effect!\n";
	} else if (typeMod < 1) {
		eventStr += "It's not very effective...\n";
	} else if (typeMod > 1) {
		eventStr += "It's super effective!\n";
	}

	dmg *= mod * crit;

	return [Math.floor(dmg), eventStr];
}
