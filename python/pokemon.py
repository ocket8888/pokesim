from nature import statMult, Natures, printNatures
from poketypes import Types, names as typeNames
from move import Move
from utils import cls

class Pokemon(object):
	"""A class representing a pokemon, and all the information that entails"""
	def __init__(self, name):
		'''Creates a pokemon, reading in basic data from a file in `../data/pokemon/<name>`'''
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
			self.availableMoves = set()
			self.moves = [None, None, None, None]

			for line in lines[13:]:
				line = line.split(" ")
				requiredLevel = int(line.pop())
				self.availableMoves.add((" ".join(line), requiredLevel))

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

	def setStats(self):
		'''Sets a pokemons's stats based on its nature, EVs and base stats
		(assumes perfect IVs)'''
		mults = statMult(self.nature)

		self.maxHP = (2 * self.maxHP) + 31 + int( self.EVs[0] / 4.0 )
		self.maxHP = int(self.maxHP * self.level / 100.0)
		self.maxHP = self.maxHP + self.level + 10
		self.HP = self.maxHP

		self.attack = (2 * self.attack) + 31 + int( self.EVs[1] / 4.0 )
		self.attack = int(self.attack * self.level / 100.0)
		self.attack += 5
		self.attack = int(self.attack * mults[0])

		self.defense = (2.0 * self.defense) + 31 + int( self.EVs[2] / 4.0 )
		self.defense = int(self.defense * self.level / 100.0)
		self.defense += 5
		self.defense = int(self.defense * mults[1])

		self.specialAttack = (2.0 * self.specialAttack) + 31 + int( self.EVs[3] / 4.0 )
		self.specialAttack = int(self.specialAttack * self.level / 100.0)
		self.specialAttack += 5
		self.specialAttack = int(self.specialAttack * mults[2])

		self.specialDefense = (2.0 * self.specialDefense) + 31 + int( self.EVs[4] / 4.0 )
		self.specialDefense = int(self.specialDefense * self.level / 100.0)
		self.specialDefense += 5
		self.specialDefense = int(self.specialDefense * mults[3])

		self.speed = (2.0 * self.speed) + 31 + int( self.EVs[5] / 4.0 )
		self.speed = int(self.speed * self.level / 100.0)
		self.speed += 5
		self.speed = int(self.speed * mults[4])

	def setMove(self, moveNo):
		'''An interactive routine to set the pokemon's `moveNo`th move'''
		available = { move[0] for move in self.availableMoves if move[1] <= self.level }
		for index, move in enumerate(self.moves):
			if move and index != moveNo:
				available.remove(move.name)
		while True:
			print("Select", self.name + "'s", "move, or type 'l' to list available moves.")
			choice = input(":")
			if choice == 'l':
				cls()
				for move in available:
					print(move)
				print()
				continue
			elif choice in available:
				self.moves[moveNo] = Move(choice)
				break
			elif choice in (x.name for x in self.moves):
				cls()
				print(self.name, "already knows", choice+"!")
				print()
			cls()
			print("Unrecognized move:", choice)
			print()

	def __repr__(self):
		'''A string representation of a Pokemon'''
		printstr = 'Lv.' + str(self.level) + ' ' + self.name +'        \n'
		printstr += "Type: " + typeNames[self.type1] + ("/" + typeNames[self.type2] + '        \n' if self.type2 != Types.TYPELESS else '        \n')
		printstr += "Height: " + str(self.height) +"m              \n"
		printstr += "Weight: " + str(self.weight) +"kg             \n"
		printstr += "Gender: "
		if self.gender == 'm':
			printstr += 'Male              \n'
		elif self.gender == 'f':
			printstr += 'Female            \n'
		elif self.gender == 'n':
			printstr += 'Genderless        \n'
		else:
			printstr += 'unset             \n'
		printstr += "Nature: " + str(self.nature) + '              \n'
		printstr += "MaxHP/CurrentHP: " + str(self.maxHP) + '/' + str(self.HP) + '\n'
		printstr += "Attack: " + str(self.attack) + '              \n'
		printstr += "Defense: " + str(self.defense) + '            \n'
		printstr += "Special Attack: " + str(self.specialAttack) + '        \n'
		printstr += "Special Defense: " + str(self.specialDefense) + '        \n'
		printstr += "Speed: " + str(self.speed) + '                \n'
		printstr += "        Moves                \n"
		printstr += "=====================        \n"
		for move in self.moves:
			if move:
				printstr += '\t' + str(move) + '             \n'


		return printstr

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

def setEVs(pokemon):
	'''An interactive procedure to set the EVs of a given pokemon'''
	total = 510
	while total:
		print("Choose a stat to put Effort Values into (You have", total, "remaining EVs to spend)")
		print()
		print("[0]: HP\t-\t", pokemon.EVs[0])
		print("[1]: Attack\t-\t", pokemon.EVs[1])
		print("[2]: Defense\t-\t", pokemon.EVs[2])
		print("[3]: Special Defense\t-\t", pokemon.EVs[3])
		print("[4]: Special Attack\t-\t", pokemon.EVs[4])
		print("[5]: Speed\t-\t", pokemon.EVs[5])
		print()
		stat = input(":")
		try:
			stat = int(stat)
			if stat not in range(6):
				cls()
				print("Please choose one of the displayed numbers")
				print()
				continue
		except:
			cls()
			print("Please enter a number")
			print()
			continue
		print()
		print("Now enter the number of effort values to increase by (max for one stat is 252)")
		amt = input(":")
		try:
			amt = int(amt)
		except:
			cls()
			print("Please enter a number")
			print()
			continue
		if amt + pokemon.EVs[stat] > 252:
			cls()
			print("Amount would overflow stat! (max 252)")
			print()
			continue
		elif amt + pokemon.EVs[stat] < 0:
			cls()
			print("Cannot have less than 0 EVs!")
			print()
		elif total - amt < 0:
			cls()
			print("You don't have that many EVs to spend!")
			print()
			continue

		pokemon.EVs[stat] += amt
		total -= amt
		cls()

def setGender(pokemon):
	'''Interactively sets a Pokemon's gender'''
	while pokemon.gender != 'n':
		print("Choose the Pokemon's gender")
		choice = input('(m/f): ')
		if choice in {'m', 'f'}:
			pokemon.gender = choice
			break
		cls()
		print("This ain't tumblr")

def setLevel(pokemon):
	'''interactively sets a Pokemon's level'''
	while not pokemon.level:
		print("Choose the Pokemon's level")
		choice = input("[1-100]: ")
		try:
			if int(choice) in range(1,101):
				pokemon.level = int(choice)
				break
			else:
				cls()
				print(choice,"is not a valid level!")
				continue
		except Exception as e:
			cls()
			print("Please enter a number.")

def setNature(pokemon):
	'''Interactively sets a Pokemon's Nature'''
	while not pokemon.nature:
		print("Choose", pokemon.name+"'s nature")
		choice = input("(Nature, or 'l' to list natures): ")
		if choice == 'l':
			cls()
			printNatures()
			print()
			continue
		elif choice in Natures:
			pokemon.nature = choice
			break
		cls()
		print("Not a nature: '"+choice+"'")

def setup(pokemon):
	'''Totally sets up a Pokemon, interactively.'''
	setGender(pokemon)
	cls()
	setLevel(pokemon)
	cls()
	setNature(pokemon)
	cls()
	setEVs(pokemon)
	pokemon.setStats()

	for i in range(4):
		pokemon.setMove(i)
		cls()
