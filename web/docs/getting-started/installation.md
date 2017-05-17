# Installation

Macko is a cross-platform Electron app. It runs on most major desktop platforms. It's 
100% free and open source software, offered under the MIT License.

## Windows

Macko is built and tested on Windows. Only 64-bit builds are available at this time.
The build is distributed as a `.zip` file. You can extract it anywhere and run 
`Macko.exe`.

## Linux

There's no official build for just Linux yet. Please keep an eye on 
[issue #8](https://github.com/te-je/macko/issues/8) for progress on this.

Linux users can still build and run Macko the source package.

## Mac

There's no official build for OS X. Have a look at 
[issue #9](https://github.com/te-je/macko/issues/9) for more details. 

As with on Linux, Macko can be built from the source package on Mac.

## Building from source

You will need to install Node.js 7 or higher and npm in order to build from source.
Npm usually comes bundled with the 
[Node installer](https://nodejs.org/en/download/).

To begin, you can download the latest [tarball] or [zipball] from GitHub and
extract it into a folder of your choice. If you want to run a specific
version, you should check out the [releases] page and download the source for
the version of your choice.

Once downloaded, extract the files into a folder (call it something like `Macko`--or
whatever you want; you're your own person) and open that folder into your command
shell. You can do this using the `cd /full/path/to/folder` (tip: most shells will
let you drag and drop a folder in order to get its full path).

From inside the folder, run:

    npm install

This should install all of the build dependencies. Once this process is complete,
you can run the build with this command:

    npm run build

After the build is complete, you'll find the application inside a folder called
`build/Macko-<platform>-<cpu>`. All you need to do is launch the executable for your
platform (for example, on Windows this is `Macko.exe`).

[tarball]: https://github.com/te-je/macko/archive/master.tar.gz
[zipball]: https://github.com/te-je/macko/archive/master.zip
[releases]: https://github.com/te-je/macko/releases