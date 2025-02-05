# PHP Beautify

This is a tool to lint and format source files in Node.js using PHP Code Sniffer and WordPress Code Standards. It bundles a PHP runtime compiled to WebAssembly, so it doesn't depend on PHP being installed on the local system.

## Install

### As global command

It can be installed as a global command.

```sh
npm install --global @tangible/php-beautify
```

### As dependency

Or install it as a dependency of an existing project.

```sh
npm install --save @tangible/php-beautify
```

In this case, use NPM script or `npx php-beautify` to run the commands described below.

#### Example of NPM script

```json
{
  "scripts" {
    "lint": "php-beautify lint src/**/*.php",
    "format": "php-beautify format src/**/*.php"
  }
}
```

## Usage

Help screen

```sh
php-beautify
```

Lint

```sh
php-beautify lint [...files]
```

Format

```sh
php-beautify format [...files]
```


## Included libraries

- [PHP WebAssembly](https://github.com/WordPress/wordpress-playground/tree/trunk/packages/php-wasm/node)

- [PHP Code Sniffer](https://github.com/PHPCSStandards/PHP_CodeSniffer)

  ```sh
  curl -LO https://github.com/PHPCSStandards/PHP_CodeSniffer/releases/download/3.11.3/phpcbf.phar
  curl -LO https://github.com/PHPCSStandards/PHP_CodeSniffer/releases/download/3.11.3/phpcs.phar
  ```

- [WordPress Coding Standard](https://github.com/WordPress/WordPress-Coding-Standards)

  ```sh
  curl -L https://github.com/WordPress/WordPress-Coding-Standards/archive/refs/tags/3.1.0.tar.gz | tar zx
  mkdir -p wpcs
  for folder in WordPress WordPress-Core WordPress-Docs WordPress-Extra; do echo "Copying $folder"; rsync -r WordPress-Coding-Standards-*/"$folder"/ wpcs/"$folder"; done
  rm -rf WordPress-Coding-Standards-*
  ```

- Dependencies
  - [PHPCSUtils](https://github.com/PHPCSStandards/PHPCSUtils)

  ```sh
  curl -L https://github.com/PHPCSStandards/PHPCSUtils/archive/refs/tags/1.0.12.tar.gz | tar zx
  rsync -vr PHPCSUtils-*/PHPCSUtils/ wpcs/PHPCSUtils
  rm -rf PHPCSUtils-*
  ```

  - [PHPCSExtra](https://github.com/PHPCSStandards/PHPCSExtra)

  ```sh
  curl -L https://github.com/PHPCSStandards/PHPCSExtra/archive/refs/tags/1.2.1.tar.gz | tar zx
  for folder in Modernize NormalizedArrays Universal; do echo "Copying $folder"; rsync -r PHPCSExtra-*/"$folder"/ wpcs/"$folder"; done
  rm -rf PHPCSExtra-*
  ```
