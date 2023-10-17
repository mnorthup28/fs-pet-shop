CREATE TABLE pets(
    id SERIAL,
    AGE INTEGER NOT NULL,
    name TEXT NOT NULL,
    kind TEXT NOT NULL
);

INSERT INTO pets(age, name, kind) values(23, 'Larry', 'Boa Constrictor');
