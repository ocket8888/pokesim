from os import name, system

def cls():
	'''Clears the terminal screen. It's really slow, but there's no other way afaik'''
	system("cls" if name == 'nt' else "clear")

def decideOrder(poke0, move0, poke1, move1):
	'''Given two pokemon and their chosen moves, determines which one should go first'''
	if move0.priority > move1.priority:
		return 0
	elif move0.priority < move1.priority:
		return 1
