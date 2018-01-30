"""
Defines pokemon types and methods for dealing with them
"""

import enum
import typing
import sys
from . import utils

class Type(enum.Enum):
	"""
	Holds information about a pokemon's type, including metadata and pretty-printing information.
	"""

	# Pokemon Types
	Normal   =  0
	Fighting =  1
	Flying   =  2
	Poison   =  3
	Ground   =  4
	Rock     =  5
	Bug      =  6
	Ghost    =  7
	Steel    =  8
	Fire     =  9
	Water    = 10
	Grass    = 11
	Electric = 12
	Psychic  = 13
	Ice      = 14
	Dragon   = 15
	Dark     = 16
	Fairy    = 17
	Shadow   = 18
	Typeless = 19

	@staticmethod
	def colors() -> typing.Dict['Type', 'utils.Color']:
		"""
		Returns a dictionary for getting the color associated with a type
		"""
		return {Type.Normal: (168, 168, 120),
		        Type.Fighting: (192, 48, 40),
		        Type.Flying: (168, 144, 240),
		        Type.Poison: (160, 64, 160),
		        Type.Ground: (224, 192, 104),
		        Type.Rock: (184, 160, 56),
		        Type.Bug: (168, 184, 32),
		        Type.Ghost: (112, 88, 152),
		        Type.Steel: (184, 184, 208),
		        Type.Fire: (240, 128, 48),
		        Type.Water: (104, 144, 240),
		        Type.Grass: (120, 200, 80),
		        Type.Electric: (248, 208, 48),
		        Type.Psychic: (248, 88, 136),
		        Type.Ice: (152, 216, 216),
		        Type.Dragon: (112, 56, 248),
		        Type.Dark: (112, 88, 72),
		        Type.Fairy: (238, 153, 172),
		        Type.Shadow: (96, 78, 130)}


	def __str__(self) -> str:
		"""
		Returns a (possibly colorful) string name of a type
		"""

		# Typeless has no string representation
		if self is Type.Typeless:
			return ""

		# Print in color if possible
		if sys.stdout.isatty():
			return utils.colorSprintf(self._name_, Type.colors()[self])
		return self._name_

# Constant types for export
NORMAL   =  Type.Normal
FIGHTING =  Type.Fighting
FLYING   =  Type.Flying
POISON   =  Type.Poison
GROUND   =  Type.Ground
ROCK     =  Type.Rock
BUG      =  Type.Bug
GHOST    =  Type.Ghost
STEEL    =  Type.Steel
FIRE     =  Type.Fire
WATER    = Type.Water
GRASS    = Type.Grass
ELECTRIC = Type.Electric
PSYCHIC  = Type.Psychic
ICE      = Type.Ice
DRAGON   = Type.Dragon
DARK     = Type.Dark
FAIRY    = Type.Fairy
SHADOW   = Type.Shadow
TYPELESS = Type.Typeless
