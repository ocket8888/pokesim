#!/usr/bin/env python3

from os import listdir
from pokemon import Pokemon, setup
from utils import cls
from random import seed, randrange

print("\033[38;2;255;87;34mWarning! This simulation uses color codes!\033[38;2;255;255;255m")
exit()
_ = input()

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
	print(choice, "is not a recognized Pokemon!")

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
opponentLines = repr(userPokemon).split('\n')
print("\t\t".join((userLines.pop(0), "versus", opponentLines.pop(0))))
print("\n".join(("\t\t\t\t".join((userLines[i], opponentLines[i])) for i in range(len(userLines)))))
print()
seed()
_ = input("Press Enter to continue.")

#Battle Begin
while True:
	cls()

	#Player chooses a move
	while True:
		for index, move in enumerate(userPokemon.moves):
			print('['+str(index+1)+']:', str(move))
		try:
			choice = int(input("Choose a move: "))
		except:
			cls()
			print("Please enter a number.")
			print()
			continue
		if choice in range(4):
			break
		cls()
		print("Please enter a number from 0 to 3.")
		print()
			
	#Computer chooses a move
	cls()
	opponentChoice = randomrange(4)

	order = 5
		
