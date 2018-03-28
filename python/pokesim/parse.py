#!/usr/bin/env python3

from pyparsing import Word, alphas, nums, Combine, oneOf

# Identifier
ident = Combine(oneOf("me you")+'.'+Word(alphas))
# ident.setParseAction(lambda s,l,t: [ eval(t[0]) ])

# literal values
val = Combine(Word(nums) + '.' + Word(nums)) |\
      Word(nums)
val.setParseAction(lambda s,l,t: [ float(t[0]) ])
val.setName("value")

# Arithmetic expression
expr = val + '+' + val |\
       val + '-' + val |\
       val + '*' + val |\
       val + '/' + val |\
       val

# Combinations of arithmetic expressions
exprs = expr + '+' + expr |\
        expr + '-' + expr |\
        expr + '*' + expr |\
        expr + '/' + expr |\
        expr

# Conditional expressions
c_expr = ident + '&' + ident |\
         ident + '|' + ident |\
         ident

# Combinations of conditional expressions
c_exprs = c_expr + '&' + c_expr |\
          c_expr + '|' + c_expr |\
          c_expr

# Conditional evaluation - if/else
if_else_cnd = c_exprs + '?' + exprs + ':' + exprs
if_else_cnd.setParseAction(lambda s,l,t: [ t[2] if t[0] else t[4] ])
      # c_exprs + '?' + exprs

# A single statement
stmt = if_else_cnd | exprs

stmt.validate()
