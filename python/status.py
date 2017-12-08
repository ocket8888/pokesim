from enum import IntFlag, unique

@unique
class Status(IntFlag):
	"""Enumerated statuses"""
	NON = 0
	PAR = 1
	PSN = 2
	BRN = 3
	SLP = 4
	FRZ = 5
