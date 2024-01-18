# pokesim
I like to build Pokemon Battle Simulations to help me learn a programming language. Each language has its own directory.

## Rules
I don't use any libraries outside of the standard library. All languages must be
able to work with the same data files. All executables must accept the same
command-line arguments (detailed below). The games played should be roughly
indistinguishable - within reason (e.g. a web browser should use UI elements
rather than attempting to recreate ANSI colors and ASCII art) - no matter what
language is used.
There are some things that may need to be explained for each language, which are
detailed below.

### Command Line Arguments
No positional arguments.

#### `-V`/`--version`
Outputs the program version. Each language can have its own version based on its
own revision history. There are two formats that are acceptable, depending on
whether the language is compiled.

- Compiled language format: `{{program name}} - Pokémon Battle Simulator - Version {{version}} (Platform: {{language}} {{OS}} {{architecture}})`
- Interpreted language format: `{{program name}} - Pokémon Battle Simulator - Version {{version}} (Platform: {{language}} {{OS}})`

... where `program name` is the name of the program/module/package/other code
unit that is distributable as the simulator (e.g. package name for Python,
module path for Go etc.), `version` is the version of the simulator, `language`
is the language in which the simulator was written (including version of the
language compiler/standard whenever possible), `OS` is the operating system
on/for which the program was built/runs, and `architecture` is the CPU
architecture of the compiled simulator binary.

### Language-Specific Caveats/Explanations
#### Python
The `setup.py` includes three dependencies:

- `readline`, which is a standard library but doesn't exist on Windows platforms unless you install it as a `pip` dependency (possibly no longer true).
- `typing`, which is a standard library but older versions of Python don't include it.
- `setuptools` used for requiring the above dependencies.

#### Javascript (NodeJS)
The `package.json` includes two development dependencies

- `typescript` because really I just wanted to write this in TypeScript. The only reason it's not in a `typescript/` directory is because I possibly want to write a Deno version one day.
- `@types/node` adds the types for the NodeJS standard libraries.
