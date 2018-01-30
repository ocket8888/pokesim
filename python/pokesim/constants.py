"""
Constants used for a variety of things
"""

import enum
import typing
from . import utils

class Stats(enum.IntEnum):
	"""
	A pokemon's stats, enumerated for ease-of-use
	"""
	Hitpoints       = 0
	Attack          = 1
	Defense         = 2
	Special_Attack  = 3
	Special_Defense = 4
	Speed           = 5
	Critical_Ratio  = 6
	Accuracy        = 7
	Evasiveness     = 8

	def __str__(self) -> str:
		"""
		Returns the name of a stat
		"""
		return self._name_.replace('_', ' ')


# Stats
HP              = Stats.Hitpoints
ATTACK          = Stats.Attack
DEFENSE         = Stats.Defense
SPECIAL_ATTACK  = Stats.Special_Attack
SPECIAL_DEFENSE = Stats.Special_Defense
SPEED           = Stats.Speed
CRIT            = Stats.Critical_Ratio
ACCURACY        = Stats.Accuracy
EVASIVENESS     = Stats.Evasiveness

class Status(enum.IntEnum):
	"""
	A pokemon's status, enumerated for ease-of-use
	"""

	non       = 0
	Paralyzed = 1
	Poisoned  = 2
	Burned    = 3
	Asleep    = 4
	Frozen    = 5

	@staticmethod
	def colors() -> typing.Dict['Status', 'utils.Color']:
		"""
		Returns a dictionary for getting the background color associated with a type
		"""
		return {Status.Paralyzed: (248, 208, 48),
		        Status.Poisoned: (160, 64, 160),
		        Status.Burned: (240, 128, 48),
		        Status.Asleep: (140, 136, 140),
		        Status.Frozen: (152, 216, 216)}

	@staticmethod
	def abbrev() -> typing.Dict['Status', str]:
		"""
		Returns a dictionry for getting a status's abbreviation
		"""
		return {Status.Paralyzed: "PAR",
		        Status.Poisoned: "PSN",
		        Status.Burned: "BRN",
		        Status.Asleep: "SLP",
		        Status.Frozen: "FRZ"}

	def __str__(self):
		"""
		Returns the standard abbreviation of a status effect
		"""
		if self == 0:
			return ''
		from sys import stdout
		if stdout.isatty():
			return utils.colorSprintfBckgrnd(Status.abbrev()[self], Status.colors()[self])
		return Status.abbrev()[self]


# Statuses
NON = Status.non
PAR = Status.Paralyzed
PSN = Status.Poisoned
BRN = Status.Burned
SLP = Status.Asleep
FRZ = Status.Frozen


def statChangeFlavorText(amt: int) -> str:
	"""
	Selects stat change flavor text. Is not really a constant, but neither is it really
	a utility. I expect a good place for this will become apparent as more functionality
	is added, but for now it'll sit here.
	"""
	if amt >= 3:
		return "rose drastically!"
	elif amt == 2:
		return "rose sharply!"
	elif amt == 1:
		return "rose!"
	elif amt == -1:
		return "fell!"
	elif amt == -2:
		return "harshly fell!"
	elif amt <= -3:
		return "severely fell!"

	# idk how else to handle this
	return "didn't change!"
