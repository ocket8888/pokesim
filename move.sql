CREATE TABLE move (name TEXT PRIMARY KEY,
                   type1 TEXT NOT NULL,
                   type2 TEXT,
                   contact INTEGER NOT NULL, --1 - makes contact, 0 - does not make contact
                   accuracy INTEGER,
                   pp INTEGER
                   kind TEXT NOT NULL,
                   power INTEGER,
                   stats TEXT, -- space-delimited array or NULL --- These must have the same length
                   stages TEXT, -- space-delimited array or NULL -/
                   crit INTEGER,
                   onhit TEXT, -- holds on-hit effects in the move DSL
                   target INTEGER NOT NULL,
                   FOREIGN KEY(type1) REFERENCES types(name),
                   FOREIGN KEY(type2) REFERENCES types(name)); -- 0 - opponent, 1 - self

CREATE TABLE learnset (pokemon TEXT,
                       move TEXT,
                       level INTEGER NOT NULL,
                       PRIMARY KEY(pokemon, move),
                       FOREIGN KEY(pokemon) REFERENCES pokemon(name),
                       FOREIGN KEY(move) REFERENCES move(name));

INSERT INTO move VALUES ('Work Up', 'Normal', NULL, 0, NULL, 48, 'Status', NULL, 'attack,specialattack', '1,1', NULL, 1);

INSERT INTO learnset VALUES ('Bulbasaur', 'Work Up', 0);
