import { stdout } from "process";
import type { Color } from "./constants"
import { colorSprintf } from "./utils";

/**
 * The Type of a Pokémon.
 */
export const enum Type {
	Normal   =  0,
	Fighting =  1,
	Flying   =  2,
	Poison   =  3,
	Ground   =  4,
	Rock     =  5,
	Bug      =  6,
	Ghost    =  7,
	Steel    =  8,
	Fire     =  9,
	Water    = 10,
	Grass    = 11,
	Electric = 12,
	Psychic  = 13,
	Ice      = 14,
	Dragon   = 15,
	Dark     = 16,
	Fairy    = 17,
	Shadow   = 18,
	Typeless = 19
}

/**
 * A mapping of Pokémon Types to their human-readable names.
 */
export const typeNames: Readonly<Record<Type, string>> = {
	[Type.Normal]: "Normal",
	[Type.Fighting]: "Fighting",
	[Type.Flying]: "Flying",
	[Type.Poison]: "Poison",
	[Type.Ground]: "Ground",
	[Type.Rock]: "Rock",
	[Type.Bug]: "Bug",
	[Type.Ghost]: "Ghost",
	[Type.Steel]: "Steel",
	[Type.Fire]: "Fire",
	[Type.Water]: "Water",
	[Type.Grass]: "Grass",
	[Type.Electric]: "Electric",
	[Type.Psychic]: "Psychic",
	[Type.Ice]: "Ice",
	[Type.Dragon]: "Dragon",
	[Type.Dark]: "Dark",
	[Type.Fairy]: "Fairy",
	[Type.Shadow]: "Shadow",

	[Type.Typeless]: ""
}

/**
 * A mapping of Pokémon Types to their respective, associated colors. These
 * colors were determined by inspecting a more-or-less randomly selected pixel
 * in the type's icon as found on Bulbapedia.
 */
export const typeColors: Readonly<Record<Type, Color>> = {
	[Type.Normal]: [168, 168, 120],
	[Type.Fighting]: [192, 48, 40],
	[Type.Flying]: [168, 144, 240],
	[Type.Poison]: [160, 64, 160],
	[Type.Ground]: [224, 192, 104],
	[Type.Rock]: [184, 160, 56],
	[Type.Bug]: [168, 184, 32],
	[Type.Ghost]: [112, 88, 152],
	[Type.Steel]: [184, 184, 208],
	[Type.Fire]: [240, 128, 48],
	[Type.Water]: [104, 144, 240],
	[Type.Grass]: [120, 200, 80],
	[Type.Electric]: [248, 208, 48],
	[Type.Psychic]: [248, 88, 136],
	[Type.Ice]: [152, 216, 216],
	[Type.Dragon]: [112, 56, 248],
	[Type.Dark]: [112, 88, 72],
	[Type.Fairy]: [238, 153, 172],
	[Type.Shadow]: [96, 78, 130],

	[Type.Typeless]: [0, 0, 0]
}

/**
 * Returns a (possibly colorful) string name of a type.
 */
export function printType(t: Type): string {
	// Typeless has no string representation
	if (t === Type.Typeless) {
		return "";
	}

	const name = typeNames[t];
	// Print in color if possible
	if (stdout.isTTY) {
		return colorSprintf(name, typeColors[t]);
	}
	return name;
}

/**
 * Attempts to construct a Type from a raw number.
 *
 * @param input The number to be parsed. This should be equivalent to the enum
 * member of the Type it represents.
 * @returns The Type represented.
 * @throws {Error} if the given raw Type cannot be parsed, and/or parses to
 * an integer that doesn't represent a Type.
 */
export function parseType(input: number): Type {
	switch(input) {
		case Type.Normal:
		case Type.Fighting:
		case Type.Flying:
		case Type.Poison:
		case Type.Ground:
		case Type.Rock:
		case Type.Bug:
		case Type.Ghost:
		case Type.Steel:
		case Type.Fire:
		case Type.Water:
		case Type.Grass:
		case Type.Electric:
		case Type.Psychic:
		case Type.Ice:
		case Type.Dragon:
		case Type.Dark:
		case Type.Fairy:
		case Type.Shadow:
		case Type.Typeless:
			return input;
	}

	throw new Error(`unrecognized internal Type representation: ${input}`);
}

/**
 * A mapping of Types to mappings of Types to the effectiveness of the first
 * Type attacking the second.
 */
export const TYPE_CHART: Readonly<Record<Type, Readonly<Record<Type, number>>>> = {
    [Type.Normal]: {
		[Type.Normal]: 1.0,
		[Type.Fighting]: 1.0,
		[Type.Flying]: 1.0,
		[Type.Poison]: 1.0,
		[Type.Ground]: 1.0,
		[Type.Rock]: 0.5,
		[Type.Bug]: 1.0,
		[Type.Ghost]: 0.0,
		[Type.Steel]: 0.5,
		[Type.Fire]: 1.0,
		[Type.Water]: 1.0,
		[Type.Grass]: 1.0,
		[Type.Electric]: 1.0,
		[Type.Psychic]: 1.0,
		[Type.Ice]: 1.0,
		[Type.Dragon]: 1.0,
		[Type.Dark]: 1.0,
		[Type.Fairy]: 1.0,
		[Type.Shadow]: 1.0,
		[Type.Typeless]: 1.0
	},
    [Type.Fighting]: {
		[Type.Normal]: 2.0,
		[Type.Fighting]: 1.0,
		[Type.Flying]: 0.5,
		[Type.Poison]: 0.5,
		[Type.Ground]: 1.0,
		[Type.Rock]: 2.0,
		[Type.Bug]: 0.5,
		[Type.Ghost]: 0.0,
		[Type.Steel]: 2.0,
		[Type.Fire]: 1.0,
		[Type.Water]: 1.0,
		[Type.Grass]: 1.0,
		[Type.Electric]: 1.0,
		[Type.Psychic]: 0.5,
		[Type.Ice]: 2.0,
		[Type.Dragon]: 1.0,
		[Type.Dark]: 2.0,
		[Type.Fairy]: 1.0,
		[Type.Shadow]: 1.0,
		[Type.Typeless]: 1.0
	},
    [Type.Flying]: {
		[Type.Normal]: 1.0,
		[Type.Fighting]: 2.0,
		[Type.Flying]: 2.0,
		[Type.Poison]: 1.0,
		[Type.Ground]: 1.0,
		[Type.Rock]: 0.5,
		[Type.Bug]: 2.0,
		[Type.Ghost]: 1.0,
		[Type.Steel]: 0.5,
		[Type.Fire]: 1.0,
		[Type.Water]: 1.0,
		[Type.Grass]: 2.0,
		[Type.Electric]: 0.5,
		[Type.Psychic]: 1.0,
		[Type.Ice]: 1.0,
		[Type.Dragon]: 1.0,
		[Type.Dark]: 1.0,
		[Type.Fairy]: 1.0,
		[Type.Shadow]: 1.0,
		[Type.Typeless]: 1.0
	},
    [Type.Poison]: {
		[Type.Normal]: 1.0,
		[Type.Fighting]: 1.0,
		[Type.Flying]: 1.0,
		[Type.Poison]: 0.5,
		[Type.Ground]: 0.5,
		[Type.Rock]: 0.5,
		[Type.Bug]: 1.0,
		[Type.Ghost]: 0.5,
		[Type.Steel]: 0.0,
		[Type.Fire]: 1.0,
		[Type.Water]: 1.0,
		[Type.Grass]: 2.0,
		[Type.Electric]: 1.0,
		[Type.Psychic]: 1.0,
		[Type.Ice]: 1.0,
		[Type.Dragon]: 1.0,
		[Type.Dark]: 2.0,
		[Type.Fairy]: 1.0,
		[Type.Shadow]: 1.0,
		[Type.Typeless]: 1.0
	},
	[Type.Ground]: {
		[Type.Normal]: 1.0,
		[Type.Fighting]: 1.0,
		[Type.Flying]: 0.0,
		[Type.Poison]: 2.0,
		[Type.Ground]: 1.0,
		[Type.Rock]: 2.0,
		[Type.Bug]: 0.5,
		[Type.Ghost]: 1.0,
		[Type.Steel]: 2.0,
		[Type.Fire]: 2.0,
		[Type.Water]: 1.0,
		[Type.Grass]: 0.5,
		[Type.Electric]: 2.0,
		[Type.Psychic]: 1.0,
		[Type.Ice]: 1.0,
		[Type.Dragon]: 1.0,
		[Type.Dark]: 1.0,
		[Type.Fairy]: 1.0,
		[Type.Shadow]: 1.0,
		[Type.Typeless]: 1.0
	},
	[Type.Rock]: {
		[Type.Normal]: 1.0,
		[Type.Fighting]: 0.5,
		[Type.Flying]: 2.0,
		[Type.Poison]: 1.0,
		[Type.Ground]: 0.5,
		[Type.Rock]: 1.0,
		[Type.Bug]: 2.0,
		[Type.Ghost]: 1.0,
		[Type.Steel]: 0.5,
		[Type.Fire]: 2.0,
		[Type.Water]: 1.0,
		[Type.Grass]: 0.5,
		[Type.Electric]: 1.0,
		[Type.Psychic]: 1.0,
		[Type.Ice]: 2.0,
		[Type.Dragon]: 1.0,
		[Type.Dark]: 1.0,
		[Type.Fairy]: 1.0,
		[Type.Shadow]: 1.0,
		[Type.Typeless]: 1.0
	},
	[Type.Bug]: {
		[Type.Normal]: 1.0,
		[Type.Fighting]: 0.5,
		[Type.Flying]: 0.5,
		[Type.Poison]: 0.5,
		[Type.Ground]: 1.0,
		[Type.Rock]: 1.0,
		[Type.Bug]: 1.0,
		[Type.Ghost]: 0.5,
		[Type.Steel]: 0.5,
		[Type.Fire]: 0.5,
		[Type.Water]: 1.0,
		[Type.Grass]: 2.0,
		[Type.Electric]: 1.0,
		[Type.Psychic]: 2.0,
		[Type.Ice]: 1.0,
		[Type.Dragon]: 1.0,
		[Type.Dark]: 2.0,
		[Type.Fairy]: 0.5,
		[Type.Shadow]: 1.0,
		[Type.Typeless]: 1.0
	},
	[Type.Ghost]: {
		[Type.Normal]: 0.0,
		[Type.Fighting]: 1.0,
		[Type.Flying]: 1.0,
		[Type.Poison]: 1.0,
		[Type.Ground]: 1.0,
		[Type.Rock]: 1.0,
		[Type.Bug]: 1.0,
		[Type.Ghost]: 2.0,
		[Type.Steel]: 1.0,
		[Type.Fire]: 1.0,
		[Type.Water]: 1.0,
		[Type.Grass]: 1.0,
		[Type.Electric]: 1.0,
		[Type.Psychic]: 2.0,
		[Type.Ice]: 1.0,
		[Type.Dragon]: 1.0,
		[Type.Dark]: 0.5,
		[Type.Fairy]: 1.0,
		[Type.Shadow]: 1.0,
		[Type.Typeless]: 1.0
	},
	[Type.Steel]: {
		[Type.Normal]: 1.0,
		[Type.Fighting]: 1.0,
		[Type.Flying]: 1.0,
		[Type.Poison]: 1.0,
		[Type.Ground]: 1.0,
		[Type.Rock]: 2.0,
		[Type.Bug]: 1.0,
		[Type.Ghost]: 1.0,
		[Type.Steel]: 0.5,
		[Type.Fire]: 0.5,
		[Type.Water]: 0.5,
		[Type.Grass]: 1.0,
		[Type.Electric]: 0.5,
		[Type.Psychic]: 1.0,
		[Type.Ice]: 2.0,
		[Type.Dragon]: 1.0,
		[Type.Dark]: 1.0,
		[Type.Fairy]: 2.0,
		[Type.Shadow]: 1.0,
		[Type.Typeless]: 1.0
	},
	[Type.Fire]: {
		[Type.Normal]: 1.0,
		[Type.Fighting]: 1.0,
		[Type.Flying]: 1.0,
		[Type.Poison]: 1.0,
		[Type.Ground]: 1.0,
		[Type.Rock]: 0.5,
		[Type.Bug]: 2.0,
		[Type.Ghost]: 1.0,
		[Type.Steel]: 2.0,
		[Type.Fire]: 0.5,
		[Type.Water]: 0.5,
		[Type.Grass]: 2.0,
		[Type.Electric]: 1.0,
		[Type.Psychic]: 1.0,
		[Type.Ice]: 2.0,
		[Type.Dragon]: 0.5,
		[Type.Dark]: 1.0,
		[Type.Fairy]: 1.0,
		[Type.Shadow]: 1.0,
		[Type.Typeless]: 1.0
	},
	[Type.Water]: {
		[Type.Normal]: 1.0,
		[Type.Fighting]: 1.0,
		[Type.Flying]: 1.0,
		[Type.Poison]: 1.0,
		[Type.Ground]: 2.0,
		[Type.Rock]: 2.0,
		[Type.Bug]: 1.0,
		[Type.Ghost]: 1.0,
		[Type.Steel]: 1.0,
		[Type.Fire]: 2.0,
		[Type.Water]: 0.5,
		[Type.Grass]: 0.5,
		[Type.Electric]: 1.0,
		[Type.Psychic]: 1.0,
		[Type.Ice]: 1.0,
		[Type.Dragon]: 0.5,
		[Type.Dark]: 1.0,
		[Type.Fairy]: 1.0,
		[Type.Shadow]: 1.0,
		[Type.Typeless]: 1.0
	},
	[Type.Grass]: {
		[Type.Normal]: 1.0,
		[Type.Fighting]: 1.0,
		[Type.Flying]: 0.5,
		[Type.Poison]: 0.5,
		[Type.Ground]: 2.0,
		[Type.Rock]: 2.0,
		[Type.Bug]: 0.5,
		[Type.Ghost]: 1.0,
		[Type.Steel]: 0.5,
		[Type.Fire]: 0.5,
		[Type.Water]: 2.0,
		[Type.Grass]: 0.5,
		[Type.Electric]: 1.0,
		[Type.Psychic]: 1.0,
		[Type.Ice]: 1.0,
		[Type.Dragon]: 0.5,
		[Type.Dark]: 1.0,
		[Type.Fairy]: 1.0,
		[Type.Shadow]: 1.0,
		[Type.Typeless]: 1.0
	},
	[Type.Electric]: {
		[Type.Normal]: 1.0,
		[Type.Fighting]: 1.0,
		[Type.Flying]: 2.0,
		[Type.Poison]: 1.0,
		[Type.Ground]: 0.0,
		[Type.Rock]: 1.0,
		[Type.Bug]: 1.0,
		[Type.Ghost]: 1.0,
		[Type.Steel]: 1.0,
		[Type.Fire]: 1.0,
		[Type.Water]: 2.0,
		[Type.Grass]: 0.5,
		[Type.Electric]: 0.5,
		[Type.Psychic]: 1.0,
		[Type.Ice]: 1.0,
		[Type.Dragon]: 0.5,
		[Type.Dark]: 1.0,
		[Type.Fairy]: 1.0,
		[Type.Shadow]: 1.0,
		[Type.Typeless]: 1.0
	},
	[Type.Psychic]: {
		[Type.Normal]: 1.0,
		[Type.Fighting]: 2.0,
		[Type.Flying]: 1.0,
		[Type.Poison]: 2.0,
		[Type.Ground]: 1.0,
		[Type.Rock]: 1.0,
		[Type.Bug]: 1.0,
		[Type.Ghost]: 1.0,
		[Type.Steel]: 0.5,
		[Type.Fire]: 1.0,
		[Type.Water]: 1.0,
		[Type.Grass]: 1.0,
		[Type.Electric]: 1.0,
		[Type.Psychic]: 0.5,
		[Type.Ice]: 1.0,
		[Type.Dragon]: 1.0,
		[Type.Dark]: 0.0,
		[Type.Fairy]: 1.0,
		[Type.Shadow]: 1.0,
		[Type.Typeless]: 1.0
	},
	[Type.Ice]: {
		[Type.Normal]: 1.0,
		[Type.Fighting]: 1.0,
		[Type.Flying]: 2.0,
		[Type.Poison]: 1.0,
		[Type.Ground]: 2.0,
		[Type.Rock]: 1.0,
		[Type.Bug]: 1.0,
		[Type.Ghost]: 1.0,
		[Type.Steel]: 0.5,
		[Type.Fire]: 0.5,
		[Type.Water]: 0.5,
		[Type.Grass]: 2.0,
		[Type.Electric]: 1.0,
		[Type.Psychic]: 1.0,
		[Type.Ice]: 0.5,
		[Type.Dragon]: 2.0,
		[Type.Dark]: 1.0,
		[Type.Fairy]: 1.0,
		[Type.Shadow]: 1.0,
		[Type.Typeless]: 1.0
	},
	[Type.Dragon]: {
		[Type.Normal]: 1.0,
		[Type.Fighting]: 1.0,
		[Type.Flying]: 1.0,
		[Type.Poison]: 1.0,
		[Type.Ground]: 1.0,
		[Type.Rock]: 1.0,
		[Type.Bug]: 1.0,
		[Type.Ghost]: 1.0,
		[Type.Steel]: 0.5,
		[Type.Fire]: 1.0,
		[Type.Water]: 1.0,
		[Type.Grass]: 1.0,
		[Type.Electric]: 1.0,
		[Type.Psychic]: 1.0,
		[Type.Ice]: 1.0,
		[Type.Dragon]: 2.0,
		[Type.Dark]: 1.0,
		[Type.Fairy]: 0.0,
		[Type.Shadow]: 1.0,
		[Type.Typeless]: 1.0
	},
	[Type.Dark]: {
		[Type.Normal]: 1.0,
		[Type.Fighting]: 0.5,
		[Type.Flying]: 1.0,
		[Type.Poison]: 1.0,
		[Type.Ground]: 1.0,
		[Type.Rock]: 1.0,
		[Type.Bug]: 1.0,
		[Type.Ghost]: 2.0,
		[Type.Steel]: 1.0,
		[Type.Fire]: 1.0,
		[Type.Water]: 1.0,
		[Type.Grass]: 1.0,
		[Type.Electric]: 1.0,
		[Type.Psychic]: 2.0,
		[Type.Ice]: 1.0,
		[Type.Dragon]: 1.0,
		[Type.Dark]: 0.5,
		[Type.Fairy]: 0.5,
		[Type.Shadow]: 1.0,
		[Type.Typeless]: 1.0
	},
	[Type.Fairy]: {
		[Type.Normal]: 1.0,
		[Type.Fighting]: 2.0,
		[Type.Flying]: 1.0,
		[Type.Poison]: 0.5,
		[Type.Ground]: 1.0,
		[Type.Rock]: 1.0,
		[Type.Bug]: 1.0,
		[Type.Ghost]: 1.0,
		[Type.Steel]: 0.5,
		[Type.Fire]: 0.5,
		[Type.Water]: 1.0,
		[Type.Grass]: 1.0,
		[Type.Electric]: 1.0,
		[Type.Psychic]: 1.0,
		[Type.Ice]: 1.0,
		[Type.Dragon]: 2.0,
		[Type.Dark]: 2.0,
		[Type.Fairy]: 1.0,
		[Type.Shadow]: 1.0,
		[Type.Typeless]: 1.0
	},
	[Type.Shadow]: {
		[Type.Normal]: 2.0,
		[Type.Fighting]: 2.0,
		[Type.Flying]: 2.0,
		[Type.Poison]: 2.0,
		[Type.Ground]: 2.0,
		[Type.Rock]: 2.0,
		[Type.Bug]: 2.0,
		[Type.Ghost]: 2.0,
		[Type.Steel]: 2.0,
		[Type.Fire]: 2.0,
		[Type.Water]: 2.0,
		[Type.Grass]: 2.0,
		[Type.Electric]: 2.0,
		[Type.Psychic]: 2.0,
		[Type.Ice]: 2.0,
		[Type.Dragon]: 2.0,
		[Type.Dark]: 2.0,
		[Type.Fairy]: 2.0,
		[Type.Shadow]: 0.5,
		[Type.Typeless]: 1.0
	},
	[Type.Typeless]: {
		[Type.Normal]: 1.0,
		[Type.Fighting]: 1.0,
		[Type.Flying]: 1.0,
		[Type.Poison]: 1.0,
		[Type.Ground]: 1.0,
		[Type.Rock]: 1.0,
		[Type.Bug]: 1.0,
		[Type.Ghost]: 1.0,
		[Type.Steel]: 1.0,
		[Type.Fire]: 1.0,
		[Type.Water]: 1.0,
		[Type.Grass]: 1.0,
		[Type.Electric]: 1.0,
		[Type.Psychic]: 1.0,
		[Type.Ice]: 1.0,
		[Type.Dragon]: 1.0,
		[Type.Dark]: 1.0,
		[Type.Fairy]: 1.0,
		[Type.Shadow]: 1.0,
		[Type.Typeless]: 1.0
	}
};
