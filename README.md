# bowerrc

[![Build Status][]][]

Switch between multiple `.bowerrc` files

Inspired by [npmrc][].

## Installation

    npm install -g bowerrc

## Usage

    $ bowerrc --help

    bowerrc

         Switch between different .bowerrc files

    USAGE:

         bowerrc         list all bowerrcs
         bowerrc [name]  use a specific bowerrc

The first time you run `bowerrc`, it will do two things:

1.  Create `~/.bowerrcs`. This is the directory used to store multiple
    `.bowerrc` files
2.  If you have an existing `~/.bowerrc`, it will copy it to
    `~/.bowerrcs/default` and create a symlink for it.

  [Build Status]: https://travis-ci.org/mithun/bowerrc.svg?branch=master
  [![Build Status][]]: https://travis-ci.org/mithun/bowerrc
  [npmrc]: https://github.com/deoxxa/npmrc
