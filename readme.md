# PHP Beautify

## Libraries

### PHP Code Sniffer

```sh
curl -LO https://github.com/squizlabs/PHP_CodeSniffer/releases/download/3.7.2/phpcbf.phar && curl -LO https://github.com/squizlabs/PHP_CodeSniffer/releases/download/3.7.2/phpcs.phar
```

- [x] Update 3.6.2 -> 3.7.2

### WordPress Coding Standard

https://github.com/WordPress/WordPress-Coding-Standards

- [x] Update 2.3.0 => 3.0.1

```sh
curl -L https://github.com/WordPress/WordPress-Coding-Standards/archive/refs/tags/3.0.1.tar.gz | tar zx
mkdir -p wpcs && for folder in WordPress WordPress-Core WordPress-Docs WordPress-Extra; do cp -r WordPress-Coding-Standards-3.0.1/"$folder" wpcs/"$folder"; done
rm -rf WordPress-Coding-Standards-3.0.1
```
