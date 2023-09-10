oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g lesslocal
$ lesslocal COMMAND
running command...
$ lesslocal (--version)
lesslocal/0.0.0 darwin-x64 node-v16.20.0
$ lesslocal --help [COMMAND]
USAGE
  $ lesslocal COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`lesslocal hello PERSON`](#lesslocal-hello-person)
* [`lesslocal hello world`](#lesslocal-hello-world)
* [`lesslocal help [COMMANDS]`](#lesslocal-help-commands)
* [`lesslocal plugins`](#lesslocal-plugins)
* [`lesslocal plugins:install PLUGIN...`](#lesslocal-pluginsinstall-plugin)
* [`lesslocal plugins:inspect PLUGIN...`](#lesslocal-pluginsinspect-plugin)
* [`lesslocal plugins:install PLUGIN...`](#lesslocal-pluginsinstall-plugin-1)
* [`lesslocal plugins:link PLUGIN`](#lesslocal-pluginslink-plugin)
* [`lesslocal plugins:uninstall PLUGIN...`](#lesslocal-pluginsuninstall-plugin)
* [`lesslocal plugins:uninstall PLUGIN...`](#lesslocal-pluginsuninstall-plugin-1)
* [`lesslocal plugins:uninstall PLUGIN...`](#lesslocal-pluginsuninstall-plugin-2)
* [`lesslocal plugins update`](#lesslocal-plugins-update)

## `lesslocal hello PERSON`

Say hello

```
USAGE
  $ lesslocal hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/y/y/blob/v0.0.0/dist/commands/hello/index.ts)_

## `lesslocal hello world`

Say hello world

```
USAGE
  $ lesslocal hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ lesslocal hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [dist/commands/hello/world.ts](https://github.com/y/y/blob/v0.0.0/dist/commands/hello/world.ts)_

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

## `lesslocal plugins`

List installed plugins.

```
USAGE
  $ lesslocal plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ lesslocal plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.2.5/src/commands/plugins/index.ts)_

## `lesslocal plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ lesslocal plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ lesslocal plugins add

EXAMPLES
  $ lesslocal plugins:install myplugin 

  $ lesslocal plugins:install https://github.com/someuser/someplugin

  $ lesslocal plugins:install someuser/someplugin
```

## `lesslocal plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ lesslocal plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ lesslocal plugins:inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.2.5/src/commands/plugins/inspect.ts)_

## `lesslocal plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ lesslocal plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ lesslocal plugins add

EXAMPLES
  $ lesslocal plugins:install myplugin 

  $ lesslocal plugins:install https://github.com/someuser/someplugin

  $ lesslocal plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.2.5/src/commands/plugins/install.ts)_

## `lesslocal plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ lesslocal plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ lesslocal plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.2.5/src/commands/plugins/link.ts)_

## `lesslocal plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ lesslocal plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ lesslocal plugins unlink
  $ lesslocal plugins remove
```

## `lesslocal plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ lesslocal plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ lesslocal plugins unlink
  $ lesslocal plugins remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.2.5/src/commands/plugins/uninstall.ts)_

## `lesslocal plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ lesslocal plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ lesslocal plugins unlink
  $ lesslocal plugins remove
```

## `lesslocal plugins update`

Update installed plugins.

```
USAGE
  $ lesslocal plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.2.5/src/commands/plugins/update.ts)_
<!-- commandsstop -->
