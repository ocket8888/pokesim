class Pokemon(object):
	"""A class representing a pokemon, and all the information that entails"""
	def __init__(self, name):
		self.name = name

		with open("../data/pokemon/"+name) as datafile:
			lines = datafile.read().split("\n")
			self.type1 = int(lines[0])
			self.type2 = int(lines[1])
			self.height = float(lines[2])
			self.weight = float(lines[3])
			self.maxHP = int(lines[4])
			self.attack = int(lines[5])
			self.defense = int(lines[6])
			self.specialAttack = int(lines[7])
			self.specialDefense = int(lines[8])
			self.speed = int(lines[9])
			self.availableAbilities = (lines[10], lines[11])
			self.ability = None
			self.availableMoves = list()
			self.moves = [None, None, None, None]

			for line in lines[12:]:
				line = line.split(" ")
				requiredLevel = int(line.pop())
				self.availableMoves.append((" ".join(line), requiredLevel))

		self.gender = 'm'
		self.accuracy = 100
		self.evasiveness = 100
		self.status = 0
		self.priority = 0
		self.HP = self.maxHP
		self.stages = [0,0,0,0,0,0,0,0]
		self.EVs = [0,0,0,0,0,0]
		self.level = 0
		self.nature = None

from enum import IntFlag, unique

@unique
class Stages(IntFlag):
	"""Holds the indices for stats in the stages array of a Pokemon"""
	ATTACK	=	0
	DEFENSE	=	1
	SPECIAL_ATTACK	=	2
	SPECIAL_DEFENSE	=	3
	SPEED	=	4
	CRIT	=	5
	ACCURACY	=	6
	EVASIVENESS	=	7
		