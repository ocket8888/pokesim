"""
Defines data structures and routines for dealing with a pokemon and its various metadata
"""

import random
import os
from . import nature
from . import move
from . import utils
from . import constants
from . import poketypes

suffixes = {0:"st", 1:"nd", 2:"rd", 3:"th"}

class Pokemon():
	"""
	A class representing a pokemon, and all the information that entails
	"""

	def __init__(self, species: str, name: str = None):
		"""
		Creates a pokemon, reading in basic data from a file in `../data/pokemon/<name>`
		"""
		self.species = species
		self.name = name if name else species
		self.accuracy = 100
		self.evasiveness = 100
		self.status = constants.NON
		self.priority = 0
		self.stages = {constants.ATTACK: 0,
		          constants.DEFENSE: 0,
		          constants.SPECIAL_ATTACK: 0,
		          constants.SPECIAL_DEFENSE: 0,
		          constants.SPEED: 0,
		          constants.CRIT: 0,
		          constants.ACCURACY: 0,
		          constants.EVASIVENESS: 0}
		self.EVs = [0,0,0,0,0,0]
		self.level = 0
		self.nature = None
		self.shadow = False

		with open(os.path.join(utils.dataDir, "pokemon", species)) as datafile:
			lines = datafile.read().split("\n")
			self.type1 = poketypes.Type(int(lines[0]))
			self.type2 = poketypes.Type(int(lines[1]))
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
			self.availableAbilities = lines[11].split(" ")
			self.ability = None
			self.availableMoves = set()
			self.moves = [None, None, None, None]

			for line in lines[12:]:
				if not line:
					# handles blank lines at the end of POSIX-compliant text files
					break
				line = line.split(" ")
				requiredLevel = int(line.pop())
				self.availableMoves.add((" ".join(line), requiredLevel))

		self.HP = self.maxHP

	def setStats(self):
		"""
		Sets a pokemons's stats based on its nature, EVs and base stats
		(assumes perfect IVs)
		"""
		mults = nature.statMult(self.nature)

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

	def setMove(self, moveNo: int):
		"""
		An interactive routine to set the pokemon's `moveNo`th move
		"""
		available = { availableMove[0] for availableMove in self.availableMoves
		                       if availableMove[1] <= self.level }

		utils.setCompleter(available)
		for index, knownMove in enumerate(self.moves):
			if knownMove and index != moveNo:
				available.remove(str(knownMove))
		while True:
			print("Select %s's %d%s move." % (self, moveNo+1, suffixes[moveNo]))
			choice = input("(move, or type 'l' to list available moves) [Debug Moveset]:")
			if not choice:
				self.moves[moveNo] = move.Move(['Growl', 'Sweet Scent', 'Razor Leaf', 'Vine Whip'][moveNo])
				break
			if choice == 'l':
				utils.cls()
				for availableMove in available:
					print(availableMove)
				print()
				continue
			elif choice in available:
				self.moves[moveNo] = move.Move(choice)
				break
			elif choice and choice in (x.name for x in self.moves if x):
				utils.cls()
				print("%s already knows %s!\n" % (self, choice))
			utils.cls()
			print("Unrecognized move: '%s'\n" % choice)

	def changeStage(self, stat: constants.Stats, amt: int) -> str:
		"""
		Changes a Pokemon's stat (specified by 'stat') stage by the given amount.
		Returns a string describing what took place.
		"""
		if amt > 0 and self.stages[stat] >= 6:
			self.stages[stat] = 6
			return "%s's %s won't go any higher!" % (self, stat)
		elif amt < 0 and self.stages[stat] <= -6:
			self.stages[stat] = -6
			return "%s's %s won't go any lower!" % (self, stat)

		self.stages[stat] = (self.stages[stat] + amt )
		if self.stages[stat] > 6:
			self.stages[stat] = 6
		elif self.stages[stat] < -6:
			self.stages[stat] = -6

		return "%s's %s %s" % (self, stat, constants.statChangeFlavorText(amt))


	def useMove(self, mymove: move.Move, otherpoke: 'Pokemon', othermove: move.Move) -> str:
		"""
		Handles what happens when a pokemon uses a move on another pokemon.
		Returns a string describing the interaction
		"""
		mymove.PP -=1
		hitChance = random.randrange(101)
		effacc = 100.0
		if self.stages[constants.ACCURACY] > 0:
			effacc *= ( 3 + self.stages[constants.ACCURACY] ) / 3.0
		elif self.stages[constants.ACCURACY] < 0:
			effacc *= 3.0 / ( 3 + self.stages[constants.ACCURACY] )

		effev = 100.0
		if otherpoke.stages[constants.EVASIVENESS] > 0:
			effev *= ( 3 + otherpoke.stages[constants.EVASIVENESS] ) / 3.0
		elif otherpoke.stages[constants.EVASIVENESS] < 0:
			effev *= 3.0 / ( 3 - otherpoke.stages[constants.EVASIVENESS] )

		if hitChance > int(mymove.accuracy * effacc / effev ):
			return "... but it %s!" % ('missed' if mymove.moveType != move.STATUS else 'failed')

		# Some damaging move, either physical or special
		if mymove.moveType != move.STATUS:
			dmg, eventStr = mymove.calcDmg(self, otherpoke, othermove)
			otherpoke.HP -= dmg
			if otherpoke.HP < 0:
				otherpoke.HP = 0
			return "%sIt dealt %d damage!" % (eventStr, dmg)

		# Some status move
		else:
			targetPoke = self if mymove.target else otherpoke
			return "\n".join(
			    targetPoke.changeStage(stat, mymove.stageChanges[i])\
			    for i, stat in\
			    enumerate(mymove.affectedStats))

	def __repr__(self) -> str:
		"""
		A string representation of a Pokemon
		"""
		printstr = ['Lv. {:<3d} {:<24s}'.format(self.level, str(self))]
		printstr.append("Type: {:>8s}{: <42s}".format(str(self.type1),
			                                '/'+str(self.type2) if self.type2 != poketypes.TYPELESS else ''))
		printstr.append("Height: %2.1fm%s" % (self.height, ' '*20))
		printstr.append("Weight: %3.1fkg%s" % (self.weight, ' '*19))
		printstr.append("Gender: {: <24}".format("Male" if self.gender == 'm' else
			                                   ("Female" if self.gender == 'f' else
			                                   ("Genderless" if self.gender == 'n' else
			                                    "unset"))))
		printstr.append("Nature: {: <24s}".format(self.nature if self.nature else 'unset'))
		printstr.append("Status: {: <24s}".format(
		                str(self.status) if self.status != constants.NON else "Healthy"))
		printstr.append("MaxHP/CurrentHP: %4d/%4d%s" % (self.maxHP, self.HP, ' '*6))
		printstr.append("Attack: %3d (Stage: %+d)%s" % (self.attack,
		                                               self.stages[constants.ATTACK],
		                                               ' '*9))
		printstr.append("Defense: %3d (Stage: %+d)%s" % (self.defense,
		                                              self.stages[constants.DEFENSE],
		                                              ' '*8))
		printstr.append("Special Attack: %3d (Stage: %+d) " % (self.specialAttack,
		                                                      self.stages[constants.SPECIAL_ATTACK]))
		printstr.append("Special Defense: %3d (Stage: %+d)" % (self.specialDefense,
			                                                  self.stages[constants.SPECIAL_DEFENSE]))
		printstr.append("Speed: %3d (Stage: %+d)%s" % (self.speed,
			                                        self.stages[constants.SPEED],
		                                            ' '*10))
		printstr.append("Crit Stage: %+d%s" % (self.stages[constants.CRIT], ' '*18))
		printstr.append("Accuracy Stage: %+d%s" % (self.stages[constants.ACCURACY], ' '*14))
		printstr.append("Evasiveness Stage: %+d%s" % (self.stages[constants.EVASIVENESS], ' '*11))
		printstr.append("        Moves%s" % (' '*19))
		printstr.append("=====================%s" % (' '*11))
		for mymove in self.moves:
			if mymove:
				printstr.append("  {:<30s}".format(str(mymove)))


		return "\n".join(printstr)

	def __str__(self) -> str:
		"""
		Returns the name of a pokemon, ready for printing
		"""
		return self.name

def setEVs(pokemon: Pokemon):
	"""
	An interactive procedure to set the EVs of a given pokemon
	"""
	total = 510
	while total:
		print("Choose a stat to put Effort Values into (You have %d remaining EVs to spend)\n"
		      % total)
		print("[0]: HP              -\t%d" % pokemon.EVs[0])
		print("[1]: Attack          -\t%d" % pokemon.EVs[1])
		print("[2]: Defense         -\t%d" % pokemon.EVs[2])
		print("[3]: Special Attack  -\t%d" % pokemon.EVs[3])
		print("[4]: Special Defense -\t%d" % pokemon.EVs[4])
		print("[5]: Speed           -\t%d\n" % pokemon.EVs[5])
		stat = input("[Default stats - 252 HP, 252 ATK, 6 DEF]:")
		if not stat:
			pokemon.EVs = [252, 252, 6, 0, 0, 0]
			utils.cls()
			break
		try:
			stat = int(stat)
			if stat not in range(6):
				utils.cls()
				print("Please choose one of the displayed numbers")
				print()
				continue
		except ValueError:
			utils.cls()
			print("Please enter a number")
			print()
			continue
		print()
		print("Now enter the number of effort values to increase by (max for one stat is 252)")
		amt = input(":")
		try:
			amt = int(amt)
		except ValueError:
			utils.cls()
			print("Please enter a number")
			print()
			continue
		utils.cls()
		if amt + pokemon.EVs[stat] > 252:
			print("Amount would overflow stat! (max 252)\n")
		elif amt + pokemon.EVs[stat] < 0:
			print("Cannot have less than 0 EVs!\n")
		elif total - amt < 0:
			print("You don't have that many EVs to spend!\n")
		else:
			pokemon.EVs[stat] += amt
			total -= amt

def setGender(pokemon: Pokemon):
	"""
	Interactively sets a Pokemon's gender
	"""
	while pokemon.gender != 'n':
		print("Choose the Pokémon's gender")
		choice = input('(m/f) [m]: ')
		if choice in {'m', 'f'}:
			pokemon.gender = choice
			break
		elif not choice:
			pokemon.gender = 'm'
			break
		utils.cls()
		print("This ain't tumblr")

def setLevel(pokemon: Pokemon):
	"""
	interactively sets a Pokemon's level
	"""
	while not pokemon.level:
		print("Choose the Pokémon's level")
		choice = input("(1-100) [100]: ")
		try:
			if not choice:
				pokemon.level = 100
			elif int(choice) in range(1,101):
				pokemon.level = int(choice)
			else:
				utils.cls()
				print("%d is not a valid level!" % choice)
		except ValueError:
			utils.cls()
			print("Please enter a number.")

def setNature(pokemon: Pokemon):
	"""
	Interactively sets a Pokemon's Nature
	"""
	utils.setCompleter(nature.Natures)
	while not pokemon.nature:
		print("Choose %s's nature" % pokemon)
		choice = input("(Nature, or 'l' to list natures) [Hardy]: ")
		if choice == 'l':
			utils.cls()
			nature.printNatures()
			print()
			continue
		elif choice in nature.Natures:
			pokemon.nature = choice
			break
		elif not choice:
			pokemon.nature = 'Hardy'
			break
		utils.cls()
		print("Not a nature: '%s'" % choice)
	utils.setCompleter(set())

def setup(pokemon: Pokemon):
	"""
	Totally sets up a Pokemon, interactively.
	"""
	utils.setCompleter(set())
	utils.cls()
	setGender(pokemon)
	utils.cls()
	setLevel(pokemon)
	utils.cls()
	setNature(pokemon)
	utils.cls()
	setEVs(pokemon)
	pokemon.setStats()

	for i in range(4):
		pokemon.setMove(i)
		utils.cls()
