"""
Constants used for a variety of things
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

typenames = {NORMAL:    "Normal",
             FIGHTING:  "Fighting",
             FLYING:    "Flying",
             POISON:    "Poison",
             GROUND:    "Ground",
             ROCK:      "Rock",
             BUG:       "Bug",
             GHOST:     "Ghost",
             STEEL:     "Steel",
             FIRE:      "Fire",
             WATER:     "Water",
             GRASS:     "Grass",
             ELECTRIC:  "Electric",
             PSYCHIC:   "Psychic",
             ICE:       "Ice",
             DRAGON:    "Dragon",
             DARK:      "Dark",
             FAIRY:     "Fairy",
             SHADOW:    "Shadow",
             TYPELESS:  ""
}

STATUS   =	0
SPECIAL  =	1
PHYSICAL =	2

movetypenames = {STATUS:	"Status",
                 SPECIAL:	"Special",
                 PHYSICAL:	"Physical"}

HP              = 0
ATTACK          = 1
DEFENSE         = 2
SPECIAL_ATTACK  = 3
SPECIAL_DEFENSE = 4
SPEED           = 5
CRIT            = 6
ACCURACY        = 7
EVASIVENESS     = 8

statnames = {HP              : "Hitpoints",
             ATTACK          : "Attack",
             DEFENSE         : "Defense",
             SPECIAL_ATTACK  : "Special Attack",
             SPECIAL_DEFENSE : "Special Defense",
             SPEED           : "Speed",
             CRIT            : "Critical Ratio",
             ACCURACY        : "Accuracy",
             EVASIVENESS     : "Evasiveness"}

NON = 0
PAR = 1
PSN = 2
BRN = 3
SLP = 4
FRZ = 5

statusnames = {NON: "",
               PAR: "Paralyzed",
               PSN: "Poisoned",
               BRN: "Burned",
               SLP: "Asleep",
               FRZ: "Frozen"}
