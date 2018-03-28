# The 'Move' Domain-Specific Language (DSL)  

This file describes the format of the Move DSL used in Pokémon Move files.

The grammar is defined in Extended Backus-Naur Form (EBNF) below:

```ebnf
MOVE_EFFS = ACTION|MOVE_EFFS "; " ACTION;
ACTION    = TYPE " " CND |TYPE " " EXPR;

# Conditional Evaluation
CND       = CND_EXPR " \? " EXPR " : " EXPR;
CND_EXPR  = ID|CND_EXPR CND_OP EXPR|CND_EXPR CND_COMB CND_EXPR|"! " CND_EXPR;
CND_OP    = " = "|" < "|" > ";
CND_COMB  = " \| "|" & ";

# Types of actions
TYPE      = "RECOIL"|STATUS|"FLINCH"|STAT_CHNG;
STATUS    = "BRN"|"PSN"|"FRZ"|"PAR"|"SLP"|"CONF";
STAT_CHNG = STAT "@" TARGET "\+" EXPR|STAT "@" TARGET "-" EXPR;
STAT      = "ATK"|"DEF"|"SA"|"SD"|"SPD"|"CRIT"|"ACC"|"EVAS";

# Valued expressions
EXPR      = VALUE|EXPR EXPR_OP VALUE;
EXPR_OP   = " \+ "|" - "|" \/ "|" \* ";
VALUE     = LITERAL|ID;
LITERAL   = "[0-9]+(\.[0-9]+)?"|PERCENT;
PERCENT   = "100|[0-9]{2}|[0-9]" "%";
ID        = TARGET "\." PROPERTY;
TARGET    = "ME"|"YOU";
PROPERTY  = "[a-zA-Z_][a-zA-Z_\.0-9]*";
```

>*Note: For brevity's sake, terminals are represented in this grammar by regular expressions which match the actual lists of terminals they are meant to represent. For whatever reason, BNF, EBNF, and ABNF all disallow this, and provide no simple way to describe lists of terminals meeting some criteria, other than defining them via the BNF (which I find needlessly tedious).*  

-------------------------------------------

An example for Struggle's on-hit effect which deals 25% of a Pokémon's maximum hit-points on hit (but won't cause fainting unless the Pokémon has exactly 1HP):

```c
RECOIL ME.HP > 1 & ME.HP < 25% * ME.maxHP ? ME.HP - 1 : 25% * ME.maxHP
```

Basically, you specify what you want to happen it terms of recoil, stat changes, etc. and then provide a value for computation. A value can access properties of the attacker with `ME.<PROPERTY>` and properties of the defender with `YOU.<PROPERTY>`.  
The value's meaning is *Context Sensitive*. For example, `RECOIL` expects a value as an actual number - which is the number of hit-points to subtract from the user - or a percent e.g. `50%` - which is the percent of damage done to be done back to the user. On the other hand, statuses expect **only** a percent - indicating the chance that the status will occur. Because of this, the grammar is not actually "context-free", and will likely change to become context-free in the future. It also cannot currently represent all effects of moves, so it will like change **a lot**.


