#!/bin/bash
# Compiles the plugin using the free Flex SDK on Linux/Mac:
# http://opensource.adobe.com/wiki/display/flexsdk/Flex+SDK

echo "Compiling swf..."

# Make sure mxmlc is on your path
mxmlc ./src/Player.as -o ./release/vine-player.swf -use-network=false -static-link-runtime-shared-libraries=true