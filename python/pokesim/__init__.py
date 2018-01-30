#!/usr/bin/env python3 -OO

"""
This package contains the functionality for a fully-playable pokemon battle simulation.
"""

import os
import random
import typing
from . import utils
from . import pokemon
from . import move

def chooseAPokemon(available: typing.Set[str], opponent: bool=False) -> pokemon.Pokemon:
	"""
	Gets a pokemon from the user
	"""

	choiceStr = "your opponent's" if opponent else 'a'

	while True:
		choice = input("Choose %s Pokemon, or enter 'l' to list available Pokemon: " % (choiceStr))

		if choice == 'l':
			utils.cls()
			print('\n'.join(available))
			continue
		elif choice in available:
			utils.cls()
			break
		else:
			print("'%s' is not a recognized Pokemon!" % choice)

	return pokemon.Pokemon(choice)

def chooseAMove(poke: pokemon.Pokemon, opponent: pokemon.Pokemon=None) -> move.Move:
	"""
	Gets a move choice from the user
	"""
	while True:
		utils.printHealthBars(poke, opponent)
		for moveNumber, mv in enumerate(poke.moves):
			print("[%d]: %s" % (moveNumber + 1, mv))
		print("[5] Print Pokemon for debugging")
		try:
			choice = int(input("Choose a move: "))
		except ValueError:
			utils.cls()
			print("Please enter a number.\n")
		else:
			if choice in range(1, 5):
				choice = poke.moves[choice - 1]
				break
			elif choice == 5:
				utils.dumpPokemon(poke, opponent)
			else:
				utils.cls()
				print("Please enter a number from 1 to 4\n")

	return choice


def main() -> int:
	"""
	Runs the main simulator
	"""

	# Theoretically reads in the list of pokemon
	available_pokemon = set(os.listdir(os.path.join(utils.dataDir, "pokemon")))
	utils.cls()

	print("Welcome to the Pokemon Battle Simulator (written in Python3)!\n")

	userPokemon = chooseAPokemon(available_pokemon)
	pokemon.setup(userPokemon)

	utils.cls()

	opponentPokemon = chooseAPokemon(available_pokemon, True)
	pokemon.setup(opponentPokemon)
	utils.cls()

	# Prints the opposing pokemon
	print("Battle Starting!\n")
	utils.dumpPokemon(userPokemon, opponentPokemon)

	random.seed()

	playerWon = False

	# Battle Loop
	while True:
		_ = input("Press Enter to continue.")

		utils.cls()

		# Player chooses a move
		choice = chooseAMove(userPokemon, opponentPokemon)

		#opponent chooses a move
		utils.cls()
		opponentChoice = opponentPokemon.moves[random.randrange(4)]

		order = utils.decideOrder(userPokemon, choice, opponentPokemon, choice)

		if order:
			opponentPokemon.useMove(opponentChoice, userPokemon, choice)
			utils.printHealthBars(userPokemon, opponentPokemon)
			print("The opponent's %s used %s!" % (opponentPokemon, opponentChoice))
			if not userPokemon.HP:
				break
			elif not opponentPokemon.HP:
				playerWon = True
				break

			utils.cls()

			userPokemon.useMove(choice, opponentPokemon, opponentChoice)
			utils.printHealthBars(userPokemon, opponentPokemon)
			print("The opponent's %s used %s!" % (opponentPokemon, opponentChoice))
			print("%s used %s!" % (userPokemon, choice))
			if not userPokemon.HP:
				break
			elif not opponentPokemon.HP:
				playerWon = True
				break

		else:
			print("%s used %s!" % (userPokemon, choice))
			userPokemon.useMove(choice, opponentPokemon, opponentChoice)
			if not userPokemon.HP:
				break
			elif not opponentPokemon.HP:
				playerWon = True
				break

			print("The opponent's %s used %s!" % (opponentPokemon, opponentChoice))
			opponentPokemon.useMove(opponentChoice, userPokemon, choice)
			if not userPokemon.HP:
				break
			elif not opponentPokemon.HP:
				playerWon = True
				break

	if playerWon:
		print("The opponent's %s fainted.\nYou Win!" % opponentPokemon)
	else:
		print("%s fainted.\nYou lose..." % userPokemon)
