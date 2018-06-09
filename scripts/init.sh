#!/bin/bash
set -euo pipefail


# Verify Homebrew is installed
if ! type "brew" > /dev/null; then
	echo -e "Installing Homebrew..."
	/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
fi


# Verify Yarn is installed
if ! type "yarn" > /dev/null; then
	echo -e "Installing Yarn..."
	brew install yarn
fi

echo -e "Installing dependencies..."
yarn
