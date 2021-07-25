#!/bin/bash

# This script is used to configure the essentials of t2d.
## 1 => Check whether the program/application, "Whiptails" exists or not.
## 2 => Making sure that the script is runing with root permissions.
## 3 => Update and Upgrade the VPS.
## 4 => Check whether the program/application, "Dokku" was Installed or not.
## 5 => Upgrading dokku to the latest version.
## 6 => Check Whether Plugins are installed or not (Redis, Postgres)
## 7 => Install Redis and Postgress, if they were not installed
## 7 => Install Ledokku
## ? => Update Script (Will be added later)

set -e

# Using tput will eliminate the usage of "-e" in echo, and can be used anywhere
## Color Palet
## Should exist in every script
RED="$(tput setaf 1)" # ${RED}
GREEN="$(tput setaf 2)" # ${GREEN}
YELLOW="$(tput setaf 3)" # ${YELLOW}
BLUE="$(tput setaf 123)" # ${BLUE}
END="$(tput setaf 7)" # ${END

# Check that dokku is installed on the server
ensure-dokku() {
  if ! command -v dokku &> /dev/null
  then
      echo "dokku is not installed, please follow our getting started guide first"
      echo "https://www.ledokku.com/docs/getting-started"
      exit
  fi
}

# Check if dokku redis plugin is intalled and otherwise install it
install-redis() {
  if sudo dokku plugin:installed redis; then
    echo "=> Redis plugin already installed skipping"
  else
    echo "=> Installing redis plugin"
    sudo dokku plugin:install https://github.com/dokku/dokku-redis.git redis
  fi
}

# Check if dokku postgres plugin is intalled and otherwise install it
install-postgres() {
  if sudo dokku plugin:installed postgres; then
    echo "=> Postgres plugin already installed skipping"
  else
    echo "=> Installing postgres plugin"
    sudo dokku plugin:install https://github.com/dokku/dokku-postgres.git postgres
  fi
}

main() {
  ensure-dokku

  # Set latest version or use the one provided by the user
  LEDOKKU_TAG=${LEDOKKU_TAG:-"0.7.0"}

  # First we get the user ip so we can use it in the text we print later
  DOKKU_SSH_HOST=$(curl -4 ifconfig.co)

  # First we create the app
  dokku apps:create ledokku

  # Create volume necessary for the ssh key
  echo "=> Creating volume"
  mkdir /var/lib/dokku/data/storage/ledokku-ssh/
  chown dokku:dokku /var/lib/dokku/data/storage/ledokku-ssh/
  dokku storage:mount ledokku /var/lib/dokku/data/storage/ledokku-ssh/:/root/.ssh

  install-redis
  install-postgres

  # We create the required databases
  echo "=> Creating databases"
  dokku redis:create ledokku
  dokku redis:link ledokku ledokku
  dokku postgres:create ledokku
  dokku postgres:link ledokku ledokku

  # Generate a random secret that will be used as JWT
  JWT_SECRET=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)

  # Set all the variables
  dokku config:set ledokku DOKKU_SSH_HOST="${DOKKU_SSH_HOST}"
  dokku config:set ledokku JWT_SECRET="${JWT_SECRET}"

  # Now it's finally time to install ledokku
  echo "=> Installation"
  dokku git:from-image ledokku ledokku/ledokku:${LEDOKKU_TAG}

  # After app is deployed last step is to properly setup the ports
  dokku proxy:ports-add ledokku http:80:4000
  dokku proxy:ports-remove ledokku http:4000:4000

  echo "=== 🐳 ==="
  echo "Ledokku was successfully installed"
  echo "Open you server ip in your browser"
  echo "http://${DOKKU_SSH_HOST}"
  echo "=== 🐳 ==="
}

main
