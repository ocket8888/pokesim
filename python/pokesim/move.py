"""
Defines data structures and routines for dealing with a pokemon's move
"""


import random
import typing
import enum
import os
from . import constants
from . import poketypes
from . import utils


def critical(movecrit: int, pokestages:int) -> float:
	"""
	Given a move's inherent critical hit ratio and a pokemon's critical stage,
	returns a multiplier to apply to damage from critical hits
	"""
	effectivestage = (movecrit + pokestages)

	if effectivestage > 3:
		return 1.5

	ratio = 1.0 / (2 ** (4-effectivestage))
	critChance = random.uniform(0,1)

	return 1.5 if ratio > critChance else 1

class MoveType(enum.IntEnum):
	"""
	The type of a move
	"""
	Status   = 0
	Special  = 1
	Physical = 2

	def __str__(self) -> str:
		"""
		Returns the name of a move type
		"""
		return self._name_

# Move Type constants for export
STATUS = MoveType.Status
SPECIAL = MoveType.Special
PHYSICAL = MoveType.Physical

class Move():
	"""
	A pokemon's move
	"""
	def __init__(self, name: str):
		"""
		Reads in a move's data. Expects it in `../data/moves/<name>`
		"""
		self.name = name
		self.priority = 0

		with open(os.path.join(utils.dataDir, "moves", name)) as datafile:
			lines = datafile.read().split('\n')
			_ = lines.pop() #eliminates POSIX-compliant empty line at file end
			self.type1 = int(lines.pop(0))
			self.type2 = int(lines.pop(0))
			self.contact = bool(int(lines.pop(0)))
			self.accuracy = int(lines.pop(0))
			self.PP = int(lines.pop(0))
			self.moveType = MoveType(int(lines.pop(0)))

		print(lines)

		if self.moveType != STATUS:
			self.damagingMove(lines)
		else:
			self.statusMove(lines)

	def damagingMove(self, lines: typing.List[str]):
		"""
		Builds a damaging move from the remaining lines in a file after common
		attributes have already been parsed out
		"""
		self.crit = int(lines.pop())
		self.power = int(lines.pop())

	def statusMove(self, lines: typing.List[str]):
		"""
		Builds a status move from the remaining lines in a file after common
		attributes have already been parsed out
		"""
		self.target = bool(int(lines.pop()))
		self.stageChange = int(lines.pop())
		self.affectedStat = int(lines.pop())

	def calcDmg(self, pkmn: object, otherpkmn: object, othermove: 'Move') -> int:
		"""
		Calculates damage done by pkmn to otherpkmn (who used 'othermove', if that matters)
		"""
		dmg = 2 * pkmn.level / 5.0
		dmg += 2
		dmg *= self.power

		crit = critical(self.crit, pkmn.stages[constants.CRIT])
		if crit > 1:
			print("Critical Hit!")

		effat, effdef = 0.0, 0.0
		atstage, defstage = None, None

		#Physical attack
		if self.moveType == PHYSICAL:
			effat = pkmn.attack
			effdef = pkmn.defense
			atstage = pkmn.stages[constants.ATTACK]
			defstage = otherpkmn.stages[constants.DEFENSE]
		#Special attack
		else:
			effat = pkmn.specialAttack
			effdef = pkmn.specialDefense
			atstage = pkmn.stages[constants.SPECIAL_ATTACK]
			defstage = otherpkmn.stages[constants.SPECIAL_DEFENSE]

		if atstage > 0:
			effat *= (2.0 + atstage) / 2.0
		elif atstage < 0 and crit == 1:
			effat *= 2.0 / (2.0 - atstage)

		if defstage > 0 and crit ==1:
			effdef *= (2.0 + defstage) / 2.0
		elif defstage < 0:
			effdef *= 2.0 / (2.0 - defstage)


		dmg *= effat/effdef
		dmg /= 50
		dmg += 2

		#Caclucate modifier
		mod = random.uniform(0.85, 1)
		if self.type1 != poketypes.TYPELESS:
			if pkmn.type1 == self.type1 or pkmn.type2 == self.type2:
				mod *= 1.5

		if self.type2 != poketypes.TYPELESS:
			if pkmn.type1 == self.type2 or pkmn.type2 == self.type2:
				mod *= 1.5

		if pkmn.status == constants.BRN and self.moveType == PHYSICAL:
			mod /= 2.0

		dmg *= mod * crit

		return int(dmg * mod)

	def __repr__(self) -> str:
		"""
		Forms an in-depth representation of a Move
		"""
		printstr = "%s\nType: %s%s\n" % (self, self.type1,
		                       ('/'+str(self.type2) if self.type2 != poketypes.TYPELESS else ''))
		printstr += "%s\nAccuracy: %s\n" % (self.moveType, self.accuracy)
		if self.moveType != STATUS:
			printstr += "Power: %s\nDoes %smake contact\n" % (self.power,
			                                                 ('not' if not self.contact else ''))
		return printstr

	def __str__(self) -> str:
		"""
		Returns the human-readable name of a Move
		"""
		return self.name
