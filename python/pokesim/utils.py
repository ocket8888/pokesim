"""
This module defines utilities, generally relating to the console, which are used
throughout the program.
"""

import random
import typing
import os
import shutil
try:
	import readline
except ImportError:
	import pyreadline as readline # Windows readline fallback
from . import constants
from . import pokemon
from . import move


###################################################################################################
###                                                                                             ###
###                                         CONSTANTS                                           ###
###                                                                                             ###
###################################################################################################

# Background Color ANSI sequences
RED_BACKGROUND = "\033[48;2;255;0;0m"
GREEN_BACKGROUND = "\033[48;2;0;160;0m"

# Foreground Color ANSI sequenses
WHITE_FOREGROUND = "\033[38;2;255;255;255m"

# Resets fore and background colors to their native settings (also restores cursor position)
NATIVE = "\033[m"

# The os.PathLike object that points to the top-level data directory
dataDir = os.path.join(os.path.abspath(os.path.dirname(__file__)), "data")

# Defines a 'Color' type for type hinting
Color = typing.NewType('Color', typing.Tuple[int, int, int])


###################################################################################################
###                                                                                             ###
###                                         FUNCTIONS                                           ###
###                                                                                             ###
###################################################################################################

def getTTYsize() -> os.terminal_size:
	"""
	Returns the terminal size
	"""
	return shutil.get_terminal_size()

def HealthBar(width: int, hp: int, maxHP: int) -> str:
	"""
	Returns a string representing a single health bar
	"""
	ret = []

	hpBlocks = int(hp/maxHP * width)
	if hpBlocks < 1 and hp > 0:
		hpBlocks = 1

	ret.append(WHITE_FOREGROUND)
	if hpBlocks > 0:
		ret.append(GREEN_BACKGROUND)
	for i, char in enumerate("{:4d}/{:<4d}".format(hp, maxHP)):
		if i == hpBlocks:
			ret.append(RED_BACKGROUND)
		ret.append(char)

	if hpBlocks < 9:
		ret += [' ' for _ in range(width - 9)]
	else:
		ret += [' ' for _ in range(hpBlocks - 9)]
		ret.append(RED_BACKGROUND)
		ret += [' ' for _ in range(width - hpBlocks)]

	ret.append(NATIVE)

	return ''.join(ret)

def printHealthBars(userPokemon: pokemon.Pokemon, opponentPokemon: pokemon.Pokemon):
	"""
	Prints both pokemons' health bars, along with relevant status information
	"""
	cols, _ = getTTYsize()
	sepPos = cols//2 - 1
	opponentSpace = cols - (cols//2 - 1)


	# Pokemon names
	print(("{: <%d}" % sepPos).format(str(userPokemon)), end=' ')
	print(("{: <%d}" % (opponentSpace - 1)).format(str(opponentPokemon)))


	# Pokemon level and status
	print("Lv. %3d  " % userPokemon.level, end='')
	if userPokemon.status != constants.NON:
		print(userPokemon.status, end='')
	else:
		print("   ", end='')
	print(" "*(sepPos - 11), end='')
	print("Lv. %3d  " % opponentPokemon.level, end='')
	if opponentPokemon.status != constants.NON:
		print(opponentPokemon.status)
	else:
		print()

	print(HealthBar(sepPos-1, userPokemon.HP, userPokemon.maxHP), end=' ')
	print(HealthBar(opponentSpace, opponentPokemon.HP, opponentPokemon.maxHP))


def colorSprintf(text: str, color: Color) -> str:
	"""
	Returns a string that will print in the specified color, by wrapping it in ANSI control codes
	"""
	return "\033[38;2;%d;%d;%dm%s\033[m" % (color[0], color[1], color[2], text)

def colorSprintfBckgrnd(text: str, bgcolor: Color, fgcolor: Color=(255, 255, 255)) -> str:
	"""
	Returns a string that will print with the given background (and optionally foreground) color(s)
	"""
	return "\033[48;2;%d;%d;%dm\033[38;2;%d;%d;%dm%s\033[m" % (bgcolor[0], bgcolor[1], bgcolor[2],
	                                                           fgcolor[0], fgcolor[1], fgcolor[2],
	                                                           text)

def cls():
	"""
	Clears the terminal screen. It's not portable to terminals that don't recognize ANSI
	control codes (e.g. on DOS), but there's no other efficient way afaik
	"""
	print("\033[H\033[J")

def decideOrder(poke0: pokemon.Pokemon, move0: move.Move,
                poke1: pokemon.Pokemon, move1: move.Move) -> int:
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

	if poke0.status == constants.PAR:
		effsp0 /= 2.0

	if poke1.stages[4] > 0:
		effsp1 *= (2 + poke1.stages[4])/2.0
	elif poke1.stages[4] < 0:
		effsp1 *= 2.0/(2.0 - poke1.stages[4])

	if poke1.status == constants.PAR:
		effsp1 /= 2.0

	#Use effective speed to calculate order
	if effsp0 > effsp1:
		return 0
	elif effsp1 > effsp0:
		return 1

	#use random number to break tie
	return random.randrange(1)

def gracefulExit():
	"""
	Handles some dumb errors I was getting while trying to exit
	"""
	cls()
	print('Shutting down')
	exit(0)

def dumpPokemon(userPokemon: pokemon.Pokemon, opponentPokemon: pokemon.Pokemon):
	"""
	Prints out two pokemon, interleaving their information on each line
	"""
	userLines = repr(userPokemon).split('\n')
	opponentLines = repr(opponentPokemon).split('\n')
	print("".join((userLines.pop(0), "versus        ", opponentLines.pop(0))))
	print("\n".join(("              ".join((line, opponentLines[i]))
	                                          for i, line in enumerate(userLines))))
	print()


def setCompleter(fullWords: typing.Set[str]):
	"""
	Sets up tab-completion for the 'fullWords' set
	"""
	def complete(text: str, state: int) -> str:
		"""
		A closure that is used as the readline completion function
		"""
		return [word for word in fullWords if word.startswith(text)][state]

	readline.set_completer_delims(' \t\n:')
	readline.parse_and_bind("tab: complete")
	readline.set_completer(complete)
