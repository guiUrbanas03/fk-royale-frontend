.PHONY: *

help:
	cat Makefile

port:
	adb reverse tcp:8000 tcp:8000

port-on:
	adb -s $(id) reverse tcp:8000 tcp:8000

list:
	emulator -list-avds

emulate:
	emulator -avd $(avd) -port $(port) 

android:
	yarn android --deviceId=$(id) --port $(port)

