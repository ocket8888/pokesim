CREATE TABLE types (name TEXT PRIMARY KEY);

INSERT INTO types VALUES ('Normal'),
                         ('Fighting'),
                         ('Flying'),
                         ('Poison'),
                         ('Ground'),
                         ('Rock'),
                         ('Bug'),
                         ('Ghost'),
                         ('Steel'),
                         ('Fire'),
                         ('Water'),
                         ('Grass'),
                         ('Electric'),
                         ('Psychic'),
                         ('Ice'),
                         ('Dragon'),
                         ('Dark'),
                         ('Fairy'),
                         ('Shadow'),
                         ('Typeless');

CREATE TABLE pokemon
	(species TEXT PRIMARY KEY,
	 type1 TEXT NOT NULL,
	 type2 TEXT,
	 attack INTEGER NOT NULL,
	 specialattack INTEGER NOT NULL,
	 defense INTEGER NOT NULL,
	 specialdefense INTEGER NOT NULL,
	 speed INTEGER NOT NULL,
	 hp INTEGER NOT NULL,
	 gender INTEGER, -- 1 - can be male or female, 2 - 100% male, 3 100% female, NULL - genderless
	 height REAL NOT NULL,
	 weight REAL NOT NULL,
	 FOREIGN KEY(type1) REFERENCES types(name),
	 FOREIGN KEY(type2) REFERENCES types(name));

INSERT INTO pokemon VALUES ('Bulbasaur', 'Grass', 'Poison', 49, 65, 49, 65, 45, 45, 1, 0.7, 6.9);
