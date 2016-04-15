@echo off

REM Running this will allow ScrimBot to play music (dependencies come in /bin/)
REM FFMpeg dependency stuff
REM FF Prompt 1.2
REM Open a command prompt to run ffmpeg/ffplay/ffprobe
REM Copyright (C) 2013-2015  Kyle Schwarz

TITLE ScrimBot command prompt

IF NOT EXIST bin\ffmpeg.exe (
  CLS
  ECHO bin\ffmpeg.exe could not be found.
  GOTO:error
)

CD bin || GOTO:error
PROMPT $P$_$G
SET PATH=%CD%;%PATH%
CLS
ffmpeg -version
CD ..
CLS
ECHO Good to go!
ECHO Make sure to run npm insall before running the bot if you have just updated

CMD /Q /K

:error
ECHO.
ECHO Error occurred. Press any key to exit.
PAUSE >nul
GOTO:EOF
