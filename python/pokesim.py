#!/usr/bin/env python3

from os import listdir
from poketypes import Types
from pokemon import Pokemon
from nature import Natures, printNatures

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
	print("This ain't tumblr")

print()

while not userPokemon.level:
	print("Choose your pokemon's level")
	choice = input("[1-100]: ")
	try:
		if int(choice) in range(1,101):
			userPokemon.level = int(choice)
			break
	except Exception as e:
		print("Please enter a number.")

while not userPokemon.nature:
	print("Choose your pokemon's nature")
	choice = input("(Nature, or 'l' to list natures): ")
	if choice == 'l':
		printNatures()
	elif choice in Natures:
		userPokemon.nature = choice
		break
