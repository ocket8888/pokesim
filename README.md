# pokesim
I like to build Pokemon Battle Simulations to help me learn a programming language. Each language has its own directory.

## Rules
I don't use any libraries outside of the standard library. All languages must be
able to work with the same data files. All executables must accept the same
command-line arguments (`-V`/`--version` to output the version - that's it).
There are some things that may need to be explained for each language, which are
detailed below.

### Python
The `setup.py` includes three dependencies:

- `readline`, which is a standard library but doesn't exist on Windows platforms unless you install it as a `pip` dependency (possibly no longer true).
- `typing`, which is a standard library but older versions of Python don't include it.
- `setuptools` used for requiring the above dependencies.

### Javascript (NodeJS)
The `package.json` includes two development dependencies

- `typescript` because really I just wanted to write this in TypeScript. The only reason it's not in a `typescript/` directory is because I possibly want to write a Deno version one day.
- `@types/node` adds the types for the NodeJS standard libraries.
