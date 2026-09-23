#!/usr/bin/env bash

set -e

echo "Activating Node"

curl -sL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install --yes nodejs
