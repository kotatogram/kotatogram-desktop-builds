# Options

When making a commit, it will make all release builds from `master` branch. If you want to change the way it builds, you can specify options in commit description:

```
Branch: dev
Updater: yes
Packer: false
```

Boolean options (like `Updater` and `Packer`) support multiple variants of setting its options: 

* `true`/`false`
* `yes`/`no`
* `enable`/`disable`
* `enabled`/`disabled`
* `on`/`off`
* `0`/`1`

They are also case-insensitive, like any option name and values.

You can also specify an optional description, like this:

```
This is an optional description for commit.

And some more description.

Branch: dev
Updater: yes
Packer: false
```

Please note that parameters should always be **in the end of description** and should be **separated by empty line**.

**P.S.** If you want to trigger build without changing files, you can use empty commits:

```sh
git commit --allow-empty
```

## Supported options

### Reference

Aliases: `ref`, `commit`, `tag`, `branch`.

Specifies target commit, tag or branch to build. Behaves like `ref` parameter from [actions/checkout](https://github.com/actions/checkout).

### Builds

Aliases: `build`, `platform`, `platforms`, `os`, `oses`.

Specfies a platform to build.

Values:
* `linux` – Linux build 
* `win`/`windows` – Windows build

This option supports multiple values, separated by comma, like this:

```
Platform: Linux, Windows
```

### Updater

Aliases: `upd`, `update`

Boolean parameter, enables in-app autoupdater and packs updater in archive on `true`. Disabled by default to preserve experimental builds as-is.

### Packer

Aliases: `pack`, `packager`.

Boolean parameter, packages build in autoupdater format on `true`. Disabled by default. Has no effect if autoupdater is disabled.

### Upload to Telegram

Aliases: `upload to tg`, `uploads to telegram`, `uploads to tg`, `telegram`, `tg`, `telegram upload`, `tg upload`, `telegram uploads`, `tg uploads`.

Boolean parameter. If enabled:

* uploads built binaries to [@ktgbuilds](https://t.me/ktgbuilds) (including installers);
* uploads update files to [@ktghbcfiles](https://t.me/ktghbcfiles) if autoupdater and packer enabled.

### Installer

Aliases: `install`.

Boolean parameter to package binaries into installer file. Effective only on Windows.

### Cache

Boolean parameter to enable or disable caching. Enabled by default.
