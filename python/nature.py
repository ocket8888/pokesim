from constants import *
Natures = {"Hardy":   None,
           "Docile":  None,
           "Serious": None,
           "Bashful": None,
           "Quirky":  None,
           "Lonely":  (ATTACK,          DEFENSE),
           "Brave":   (ATTACK,          SPEED),
           "Adamant": (ATTACK,          SPECIAL_ATTACK),
           "Naughty": (ATTACK,          SPECIAL_DEFENSE),
           "Bold":    (DEFENSE,         ATTACK),
           "Relaxed": (DEFENSE,         SPEED),
           "Impish":  (DEFENSE,         SPECIAL_ATTACK),
           "Lax":     (DEFENSE,         SPECIAL_DEFENSE),
           "Timid":   (SPEED,           ATTACK),
           "Hasty":   (SPEED,           DEFENSE),
           "Jolly":   (SPEED,           SPECIAL_ATTACK),
           "Naive":   (SPEED,           SPECIAL_DEFENSE),
           "Modest":  (SPECIAL_ATTACK,  ATTACK),
           "Mild":    (SPECIAL_ATTACK,  DEFENSE),
           "Quiet":   (SPECIAL_ATTACK,  SPEED),
           "Rash":    (SPECIAL_ATTACK,  SPECIAL_DEFENSE),
           "Calm":    (SPECIAL_DEFENSE, ATTACK),
           "Gentle":  (SPECIAL_DEFENSE, DEFENSE),
           "Sassy":   (SPECIAL_DEFENSE, SPEED),
           "Careful": (SPECIAL_DEFENSE, SPECIAL_ATTACK)}

def statMult(nature):
	affected = Natures[nature]
	mults = [1.0, 1.0, 1.0, 1.0, 1.0]
	if affected:
		mults[affected[0]] = 1.1
		mults[affected[1]] = 0.9
	return mults

def printNatures():
	"""
  Pretty-prints natures for display
  """
	for nature in Natures:
		printme = f"{nature}: "
		effects = Natures[nature]
		if not effects:
			printme += "No effects"
		else:
			printme += f"+{statnames[effects[0]]}; -{statnames[effects[1]]}"
		print(printme)
