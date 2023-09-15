Deploy your Less infrastructure locally 🚀
=================

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @fabyosk/lesslocal
$ lesslocal COMMAND
running command...
$ lesslocal (--version)
@fabyosk/lesslocal/1.0.0-beta-6 darwin-x64 node-v16.20.0
$ lesslocal --help [COMMAND]
USAGE
  $ lesslocal COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`lesslocal deploy`](#lesslocal-deploy)
* [`lesslocal help [COMMANDS]`](#lesslocal-help-commands)

## `lesslocal deploy`

Deploy your infrastructure locally

```
USAGE
  $ lesslocal deploy [-w]

FLAGS
  -w, --watch  Watch for changes

DESCRIPTION
  Deploy your infrastructure locally

EXAMPLES
  $ lesslocal deploy

  $ lesslocal deploy --watch
```

_See code: [dist/commands/deploy/index.ts](https://github.com/FabyoSK/lesslocal/blob/v1.0.0-beta-6/dist/commands/deploy/index.ts)_

## `lesslocal help [COMMANDS]`

Display help for lesslocal.

```
USAGE
  $ lesslocal help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for lesslocal.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.16/src/commands/help.ts)_
<!-- commandsstop -->
