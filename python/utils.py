from os import name, system
from status import Status
from random import randrange

def cls():
	"""
	Clears the terminal screen. It's not portable to terminals that don't recognize ANSI
	control codes (e.g. on DOS), but there's no other efficient way afaik
	"""
	print("\033[H\033[J")

def colorPrint(text, color):
	print("\033[38;2;"+';'.join(color)+'m'+text+"\033[38;2;255;255;255m")

def decideOrder(poke0, move0, poke1, move1):
	"""
	Given two pokemon and their chosen moves, determines which one should go first
	"""
	if move0.priority > move1.priority:
		return 0
	elif move0.priority < move1.priority:
		return 1

	#Priorities are the same, calculate effective speeds
	effsp0, effsp1 = poke0.speed, poke1.speed

	if poke0.stages[4] > 0:
		effsp0 *= (2 + poke0.stages[4])/2.0
	elif poke0.stages[4] < 0:
		effsp0 *= 2.0/(2.0 - poke0.stages[4])

	if poke0.status == Status.PAR:
		effsp0 /= 2.0

	if poke1.stages[4] > 0:
		effsp1 *= (2 + poke1.stages[4])/2.0
	elif poke1.stages[4] < 0:
		effsp1 *= 2.0/(2.0 - poke1.stages[4])

	if poke1.status == Status.PAR:
		effsp1 /= 2.0

	#Use effective speed to calculate order
	if effsp0 > effsp1:
		return 0
	elif effsp1 > effsp0:
		return 1

	#use random number to break tie
	return randrange(1)

def gracefulExit():
	cls()
	import sys.exit
	from os import _exit
	print('Shutting down')
	try:
		sys.exit(0)
	except SystemExit:
		_exit(0)
