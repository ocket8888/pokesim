"""
Contains everything you'll ever need to know about a pokemon's nature
"""

import typing
from . import constants

Natures = {"Hardy":   None,
					 "Docile":  None,
					 "Serious": None,
					 "Bashful": None,
					 "Quirky":  None,
					 "Lonely":  (constants.ATTACK,          constants.DEFENSE),
					 "Brave":   (constants.ATTACK,          constants.SPEED),
					 "Adamant": (constants.ATTACK,          constants.SPECIAL_ATTACK),
					 "Naughty": (constants.ATTACK,          constants.SPECIAL_DEFENSE),
					 "Bold":    (constants.DEFENSE,         constants.ATTACK),
					 "Relaxed": (constants.DEFENSE,         constants.SPEED),
					 "Impish":  (constants.DEFENSE,         constants.SPECIAL_ATTACK),
					 "Lax":     (constants.DEFENSE,         constants.SPECIAL_DEFENSE),
					 "Timid":   (constants.SPEED,           constants.ATTACK),
					 "Hasty":   (constants.SPEED,           constants.DEFENSE),
					 "Jolly":   (constants.SPEED,           constants.SPECIAL_ATTACK),
					 "Naive":   (constants.SPEED,           constants.SPECIAL_DEFENSE),
					 "Modest":  (constants.SPECIAL_ATTACK,  constants.ATTACK),
					 "Mild":    (constants.SPECIAL_ATTACK,  constants.DEFENSE),
					 "Quiet":   (constants.SPECIAL_ATTACK,  constants.SPEED),
					 "Rash":    (constants.SPECIAL_ATTACK,  constants.SPECIAL_DEFENSE),
					 "Calm":    (constants.SPECIAL_DEFENSE, constants.ATTACK),
					 "Gentle":  (constants.SPECIAL_DEFENSE, constants.DEFENSE),
					 "Sassy":   (constants.SPECIAL_DEFENSE, constants.SPEED),
					 "Careful": (constants.SPECIAL_DEFENSE, constants.SPECIAL_ATTACK)}

def statMult(nature: str) -> typing.List[float]:
	"""
	Returns the stat changes as an array for the specified nature
	"""
	affected = Natures[nature]
	mults = [1.0, 1.0, 1.0, 1.0, 1.0]
	if affected:
		mults[affected[0] - 1] = 1.1
		mults[affected[1] - 1] = 0.9
	return mults

def printNatures():
	"""
	Pretty-prints natures for display
	"""
	for nature in Natures:
		printme = "%s: " % nature
		effects = Natures[nature]
		if not effects:
			printme += "No effects"
		else:
			printme += "+%s; -%s" % (effects[0], effects[1])
		print(printme)
