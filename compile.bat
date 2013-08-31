@echo off
>concat.js (for /r ".\" %%F in (*.js) do type "%%F")

java -jar c:\closure\compiler.jar --js concat.js --js_output_file concat.min.js