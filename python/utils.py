from os import name, system

def cls():
	'''Clears the terminal screen. It's really slow, but there's no other way afaik'''
	system("cls" if name == 'nt' else "clear")