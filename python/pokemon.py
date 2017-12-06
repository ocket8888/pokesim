class Pokemon(object):
	"""A class representing a pokemon, and all the information that entails"""
	def __init__(self, name):
		self.name = name

		with open("../data/pokemon/"+name) as datafile:
			lines = datafile.read().split("\n")
			self.type1 = int(lines[0])
			self.type2 = int(lines[1])
			if int(lines[2]):
				self.gender = 'n'
			else:
				self.gender = 'm'
			self.height = float(lines[3])
			self.weight = float(lines[4])
			self.maxHP = int(lines[5])
			self.attack = int(lines[6])
			self.defense = int(lines[7])
			self.specialAttack = int(lines[8])
			self.specialDefense = int(lines[9])
			self.speed = int(lines[10])
			self.availableAbilities = (lines[11], lines[12])
			self.ability = None
			self.availableMoves = list()
			self.moves = [None, None, None, None]

			for line in lines[13:]:
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
		