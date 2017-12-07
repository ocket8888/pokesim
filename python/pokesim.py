#!/usr/bin/env python3

from os import listdir
from pokemon import Pokemon, setup
from utils import cls

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

print(userPokemon)
_=input()
print(opponentPokemon)