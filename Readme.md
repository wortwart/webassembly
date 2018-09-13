# WebAssembly Demo Project

This project calculates Fibonacci numbers in C++ and JavaScript, using two different
algorithms, and measures performance.

- fibonacci.cpp	C++ code, can be compiled with Emscripten/Clang, c++ or other C++ compiler
- container.html	HTML shell for Emscripten compilation
- formdata.js	Script required by container.html
- style.css	CSS required by container.html

This project can be compiled with [Emscripten](https://github.com/kripken/emscripten/) using the following command (Windows syntax):

    emcc fibonacci.cpp -s "EXPORTED_FUNCTIONS=['_fibstring']" -s "EXTRA_EXPORTED_RUNTIME_METHODS=['cwrap']" -O3 --shell-file container.html -o fibonacci.html

Linux syntax:

    emcc fibonacci.cpp -s EXPORTED_FUNCTIONS='["_fibstring"]' -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' -O3 --shell-file container.html -o fibonacci.html

This project was created as demo for a tutorial in [c't Magazin](https://ct.de/), autumn 2018.
