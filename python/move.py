from poketypes import Types, names as typeNames
from enum import IntFlag, unique
from status import Status
from random import uniform
from math import floor
from stats import *

@unique
class MoveTypes(IntFlag):
	"""
	Enumerated move tyes
	"""
	STATUS   =	0
	SPECIAL  =	1
	PHYSICAL =	2

moveTypeNames = {MoveTypes.STATUS:	"Status",
                 MoveTypes.SPECIAL:	"Special",
                 MoveTypes.PHYSICAL:	"Physical"}

class Move():
	"""
	A pokemon's move
	"""
	def __init__(self, name):
		"""
		Reads in a move's data. Expects it in `../data/moves/<name>`
		"""
		self.name = name
		self.priority = 0

		with open("../data/moves/"+name) as datafile:
			lines = datafile.read().split('\n')
			_ = lines.pop() #eliminates POSIX-compliant empty line at file end
			self.type1 = int(lines.pop(0))
			self.type2 = int(lines.pop(0))
			self.contact = bool(lines.pop(0))
			self.accuracy = int(lines.pop(0))
			self.PP = int(lines.pop(0))
			self.moveType = int(lines.pop(0))

		print(lines)
		
		if self.moveType:
			self.damagingMove(lines)
		else:
			self.statusMove(lines)

	def damagingMove(self, lines):
		"""
		Builds a damaging move from the remaining lines in a file after common
		attributes have already been parsed out
		"""
		self.crit = int(lines.pop())
		self.power = int(lines.pop())

	def statusMove(self, lines):
		"""
		Builds a status move from the remaining lines in a file after common
		attributes have already been parsed out
		"""
		self.target = bool(lines.pop())
		self.stageChange = int(lines.pop())
		self.affectedStat = int(lines.pop())

	def calcDmg(self, pkmn, otherpkmn, othermove):
		"""
		Calculates damage done by pkmn to otherpkmn (who used 'othermove', if that matters)
		"""
		dmg = 2 * pkmn.level / 5.0
		dmg += 2
		dmg *= self.power

		effat, effdef = 0.0, 0.0

		#Physical attack
		if self.moveType == MoveTypes.PHYSICAL:
			effat = pkmn.attack

			if pkmn.stages[ATTACK] > 0:
				effat *= (2.0 + pkmn.stages[ATTACK]) / 2.0
			if pkmn.stages[ATTACK] < 0:
				effat *= 2.0 / (2.0 - pkmn.stages[ATTACK])

			effdef = otherpkmn.defense

			if otherpkmn.stages[DEFENSE] > 0:
				effdef *= (2.0 + otherpkmn.stages[DEFENSE]) / 2.0
			elif otherpkmn.stages[DEFENSE] < 0:
				effdef *= 2.0 / (2.0 - otherpkmn.stages[DEFENSE])

		#Special attack
		elif self.moveType == MoveTypes.SPECIAL:
			effat = pkmn.specialAttack

			if pkmn.stages[2] > 0:
				effat *= (2.0 + pkmn.stages[2]) / 2.0
			if pkmn.stages[2] < 0:
				effat *= 2.0 / (2.0 - pkmn.stages[2])

			effdef = otherpkmn.specialDefense

			if otherpkmn.stages[3] > 0:
				effdef *= (2.0 + otherpkmn.stages[3]) / 2.0
			elif otherpkmn.stages[3] < 0:
				effdef *= 2.0 / (2.0 - otherpkmn.stages[3])

		dmg *= effat/effdef
		dmg /= 50
		dmg += 2

		#Caclucate modifier
		mod = uniform(0.85, 1)
		if self.type1 != Types.TYPELESS:
			if pkmn.type1 == self.type1 or pkmn.type2 == self.type2:
				mod *= 1.5

		if self.type2 != Types.TYPELESS:
			if pkmn.type1 == self.type2 or pkmn.type2 == self.type2:
				mod *= 1.5

		if pkmn.status == Status.BRN and self.moveType == MoveTypes.PHYSICAL:
			mod /= 2.0

		dmg *= mod

		return int(dmg * mod)

	def __repr__(self):
		printstr = f"{self.name}\n"
		printstr += f"Type: {typeNames[self.type1]}{('/'+typeNames[self.type2] if self.type2 != Types.TYPELESS else '')}"
		printstr += f"{moveTypeNames[self.moveType]}\n"
		printstr += f"Accuracy: {self.accuracy}\n"
		if self.moveType:
			printstr += f"Power: {self.power}\n"
			printstr += f"Does {('not' if not self.contact else '')} make contact\n"

	def __str__(self):
		return self.name
		
