#!/usr/bin/env python3

from os import listdir
from pokemon import Pokemon, setup
from utils import cls, decideOrder, gracefulExit
from random import seed, randrange

available = set(listdir("../data/pokemon"))
cls()
print("Welcome to the Pokemon Battle Simulator (written in Python3)!")
print()
choice = str()
while True:
	choice = input("Choose a Pokemon, or enter 'l' to list available Pokemon: ")
	if choice == 'l':
		cls()
		print("\n".join(available))
		continue
	elif choice in available:
		break
	cls()
	print(f"{choice} is not a recognized Pokemon!")

cls()
userPokemon = Pokemon(choice)

setup(userPokemon)
cls()

while True:
	choice = input("Choose your opponent's Pokemon, or enter 'l' to list available Pokemon: ")
	if choice == 'l':
		cls()
		print("\n".join(available))
		continue
	elif choice in available:
		break
	cls()
	print(choice, "is not a recognized Pokemon!")

cls()
opponentPokemon = Pokemon(choice)

setup(opponentPokemon)
cls()

print("Battle Starting!")
print()
userLines = repr(userPokemon).split('\n')
opponentLines = repr(opponentPokemon).split('\n')
print("\t\t".join((userLines.pop(0), "versus", opponentLines.pop(0))))
print("\n".join(("\t\t\t\t".join((userLines[i], opponentLines[i])) for i in range(len(userLines)))))
print()
seed()

playerWon = False

#Battle Begin
while True:
	_ = input("Press Enter to continue.")
	cls()

	#Player chooses a move
	while True:
		for index, move in enumerate(userPokemon.moves):
			print(f"[{index+1}]: {move}")
		try:
			choice = int(input("Choose a move: "))
		except Exception as e:
			if type(e) is KeyboardInterrupt:
				gracefulExit()
			cls()
			print("Please enter a number.")
			print()
			continue
		if choice in range(1,5):
			choice = userPokemon.moves[choice - 1]
			break
		cls()
		print("Please enter a number from 1 to 4.")
		print()
			
	#Computer chooses a move
	cls()
	opponentChoice = opponentPokemon.moves[randrange(4)]

	order = decideOrder(userPokemon, choice, opponentPokemon, opponentChoice)

	if order:
		print(f"The opponent's {opponentPokemon.name} used {opponentChoice.name}!")
		opponentPokemon.useMove(opponentChoice, userPokemon, choice)
		if not userPokemon.HP:
			break
		elif not opponentPokemon.HP:
			playerWon = True
			break

		print(f"{userPokemon.name} used {choice.name}!")
		userPokemon.useMove(choice, opponentPokemon, opponentChoice)
		if not opponentPokemon.HP:
			playerWon = True
			break
		elif not userPokemon.HP:
			break

	else:
		print(f"{userPokemon.name} used {choice.name}!")
		userPokemon.useMove(choice, opponentPokemon, opponentChoice)
		if not opponentPokemon.HP:
			playerWon = True
			break
		elif not userPokemon.HP:
			break
		
		print(f"The opponent's {opponentPokemon.name} used {opponentChoice.name}!")
		opponentPokemon.useMove(opponentChoice, userPokemon, choice)
		if not userPokemon.HP:
			break
		elif not opponentPokemon.HP:
			playerWon = True
			break

if playerWon:
	print(f"The opponent's {opponentPokemon.name} fainted.\nYou Win!")
else:
	print(f"{userPokemon.name} fainted.\nYou lose...")
