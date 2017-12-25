Natures = {"Hardy": None,
           "Docile": None,
           "Serious": None,
           "Bashful": None,
           "Quirky": None,
           "Lonely": (0, 1),
           "Brave": (0, 4),
           "Adamant": (0, 2),
           "Naughty": (0, 3),
           "Bold": (1, 0),
           "Relaxed": (1, 4),
           "Impish": (1, 2),
           "Lax": (1, 3),
           "Timid": (4, 0),
           "Hasty": (4, 1),
           "Jolly": (4, 2),
           "Naive": (4, 3),
           "Modest": (2, 0),
           "Mild": (2, 1),
           "Quiet": (2, 4),
           "Rash": (2, 3),
           "Calm": (3, 0),
           "Gentle": (3, 1),
           "Sassy": (3, 4),
           "Careful": (3, 2)}

def statMult(nature):
	affected = Natures[nature]
	mults = [1.0, 1.0, 1.0, 1.0, 1.0]
	if affected:
		mults[affected[0]] = 1.1
		mults[affected[1]] = 0.9
	return mults

def printNatures():
	'''Pretty-prints natures for display'''
	stats = ["attack", "defense", "special attack", "special defense", "speed"]
	for nature in Natures:
		printme = f"{nature}: "
		effects = Natures[nature]
		if not effects:
			printme += "No effects"
		else:
			printme += f"+{stats[effects[0]]}; -{stats[effects[1]]}"
		print(printme)
