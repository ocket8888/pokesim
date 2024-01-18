import { Stat, statName } from "./constants";

/**
 * A Stat that can be affected by a Pokémon's Nature.
 */
export type NatureAffectedStat = Exclude<Stat, Stat.Hitpoints | Stat.Accuracy | Stat.Critical_Ratio | Stat.Evasiveness>;

/**
 * A mapping of Nature names to their respective stat changes. If a Nature does
 * not affect stats, the value will be `null`. Otherwise, it will be a tuple of
 * the stat that is *in*creased and the stat that is *de*creased - in that
 * order.
 */
export const NATURES: Readonly<Record<string, null | readonly [NatureAffectedStat, NatureAffectedStat]>> = {
	Hardy:   null,
	Docile:  null,
	Serious: null,
	Bashful: null,
	Quirky:  null,
	Lonely:  [Stat.Attack,          Stat.Defense],
	Brave:   [Stat.Attack,          Stat.Speed],
	Adamant: [Stat.Attack,          Stat.Special_Attack],
	Naughty: [Stat.Attack,          Stat.Special_Defense],
	Bold:    [Stat.Defense,         Stat.Attack],
	Relaxed: [Stat.Defense,         Stat.Speed],
	Impish:  [Stat.Defense,         Stat.Special_Attack],
	Lax:     [Stat.Defense,         Stat.Special_Defense],
	Timid:   [Stat.Speed,           Stat.Attack],
	Hasty:   [Stat.Speed,           Stat.Defense],
	Jolly:   [Stat.Speed,           Stat.Special_Attack],
	Naive:   [Stat.Speed,           Stat.Special_Defense],
	Modest:  [Stat.Special_Attack,  Stat.Attack],
	Mild:    [Stat.Special_Attack,  Stat.Defense],
	Quiet:   [Stat.Special_Attack,  Stat.Speed],
	Rash:    [Stat.Special_Attack,  Stat.Special_Defense],
	Calm:    [Stat.Special_Defense, Stat.Attack],
	Gentle:  [Stat.Special_Defense, Stat.Defense],
	Sassy:   [Stat.Special_Defense, Stat.Speed],
	Careful: [Stat.Special_Defense, Stat.Special_Attack]
};

/**
 * Returns the stat changes as an array for the specified Nature.
 * @param nature
 * @returns An array of stat multipliers.
 */
export function natureStatMultiplier(nature: string | null): Readonly<Record<NatureAffectedStat, number>> {
	const mults: Record<NatureAffectedStat, number> = {
		[Stat.Defense]: 1,
		[Stat.Speed]: 1,
		[Stat.Special_Attack]: 1,
		[Stat.Special_Defense]: 1,
		[Stat.Attack]: 1
	};
	if (!nature) {
		return mults;
	}
	const affected = NATURES[nature];
	if (affected) {
		mults[affected[0]] = 1.1;
		mults[affected[1]] = 0.9;
	}
	return mults;
}

/**
 * Pretty-prints natures for display.
 */
export function printNatures(): void {
	for (const [name, effects] of Object.entries(NATURES)) {
		let printme = `${name}: `;
		if (!effects) {
			printme += "No effects";
		} else {
			printme += `+${statName(effects[0])}; -${statName(effects[1])}`;
		}
		console.log(printme);
	}
}
