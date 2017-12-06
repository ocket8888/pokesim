#!/usr/bin/env python3

from os import listdir
from poketypes import Types
from pokemon import Pokemon

available = set(listdir("../data/pokemon"))

print("Welcome to the Pokemon Battle Simulator (written in Python3)!")
print()
choice = str()
while True:
	choice = input("Choose a Pokemon, or enter 'l' to list available pokemon: ")
	if choice == 'l':
		print("\n".join(available))
		continue
	elif choice in available:
		break
	print(choice, "is not a recognized Pokemon.")

userPokemon = Pokemon(choice)

while userPokemon.gender != 'n':
	print("Choose your pokemon's gender")
	choice = input('(m/f): ')
	if choice in {'m', 'f'}:
		userPokemon.gender = choice
		break