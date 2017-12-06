Natures = {"Hardy": None,
           "Lonely": (1, 2)}

def printNatures():
	'''Pretty-prints natures for display'''
	stats = ["hp", "attack", "defense", "special attack", "special defense", "speed"]
	for nature in Natures:
		printme = nature + ": "
		effects = Natures[nature]
		if not effects:
			printme += "No effects"
		else:
			printme += "+" + stats[effects[0]] + '; -' + stats[effects[1]]
		print(printme)
