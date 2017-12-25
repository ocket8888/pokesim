from enum import IntFlag, unique

@unique
class Types(IntFlag):
	"""
	An enumerated list of valid types for pokemon and moves
	"""
	NORMAL	 =	0
	FIGHTING =	1
	FLYING	 =	2
	POISON	 =	3
	GROUND	 =	4
	ROCK	 =	5
	BUG 	 =	6
	GHOST	 =	7
	STEEL	 =	8
	FIRE	 =	9
	WATER	 =	10
	GRASS	 =	11
	ELECTRIC =	12
	PSYCHIC	 =	13
	ICE 	 =	14
	DRAGON	 =	15
	DARK	 =	16
	FAIRY	 =	17
	SHADOW	 =	18
	TYPELESS =	19

names = {   Types.NORMAL:	"Normal",
            Types.FIGHTING:	"Fighting",
            Types.FLYING:	"Flying",
            Types.POISON:	"Poison",
            Types.GROUND:	"Ground",
            Types.ROCK: 	"Rock",
            Types.BUG:  	"Bug",
            Types.GHOST:	"Ghost",
            Types.STEEL:	"Steel",
            Types.FIRE: 	"Fire",
            Types.WATER:	"Water",
            Types.GRASS:	"Grass",
            Types.ELECTRIC:	"Electric",
            Types.PSYCHIC:	"Psychic",
            Types.ICE:  	"Ice",
            Types.DRAGON:	"Dragon",
            Types.DARK: 	"Dark",
            Types.FAIRY:	"Fairy",
            Types.SHADOW:	"Shadow",
            Types.TYPELESS:	""
}
