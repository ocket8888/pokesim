from poketypes import Types, names as typeNames
from enum import IntFlag, unique

@unique
class MoveTypes(IntFlag):
	"""Enumerated move tyes"""
	STATUS   =	0
	SPECIAL  =	1
	PHYSICAL =	2

moveTypeNames = {MoveTypes.STATUS:	"Status",
                 MoveTypes.SPECIAL:	"Special",
                 MoveTypes.PHYSICAL:	"Physical"}

class Move():
	"""A pokemon's move"""
	def __init__(self, name):
		'''Reads in a move's data. Expects it in `../data/moves/<name>`'''
		self.name = name
		with open("../data/moves/"+name) as datafile:
			lines = datafile.read().split('\n')
			self.type1 = int(lines[0])
			self.type2 = int(lines[1])
			self.moveType = int(lines[2])
			self.contact = bool(int(lines[3]))
			self.power = int(lines[4])
			self.crit = bool(int(lines[5]))
			self.accuracy = int(lines[6])
			self.PP = int(lines[7])

	def __repr__(self):
		printstr = self.name + '\n'
		printstr += 'Type: '+typeNames[self.type1]+('/'+typeNames[self.type2]+'\n' if self.type2 != Types.TYPELESS else '\n')
		printstr += moveTypeNames[self.moveType] + '\n'
		printstr += 'Accuracy: ' + str(self.accuracy) + '\n'
		if self.moveType:
			printstr += 'Power: ' + str(self.power) + '\n'
			printstr += "Does " + ("not " if not self.contact else "") + "make contact\n"

	def __str__(self):
		return self.name