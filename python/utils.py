from os import name, system
from status import Status
from random import choice

def cls():
	'''Clears the terminal screen. It's really slow, but there's no other way afaik'''
	system("cls" if name == 'nt' else "clear")

def decideOrder(poke0, move0, poke1, move1):
	'''Given two pokemon and their chosen moves, determines which one should go first'''
	if move0.priority > move1.priority:
		return 0
	elif move0.priority < move1.priority:
		return 1

	#Priorities are the same, calculate effective speeds
	effsp0, effsp1 = poke0.speed, poke1.speed

	if poke0.stages[4] > 0:
		effsp0 *= (3 + poke0.stages[4])/3.0
	elif poke0.stages[4] < 0:
		effsp0 *= 3.0/(3.0 - poke0.stages[4])

	if poke0.status == Status.PAR:
		effsp0 /= 2.0

	if poke1.stages[4] > 0:
		effsp1 *= (3 + poke1.stages[4])/3.0
	elif poke1.stages[4] < 0:
		effsp1 *= 3.0/(3.0 - poke1.stages[4])

	if poke1.status == Status.PAR:
		effsp1 /= 2.0

	#Use effective speed to calculate 

