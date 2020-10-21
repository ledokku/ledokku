#!/bin/bash
# This script will install ledokku on your server
# You need to already have dokku installed in order to be able to run it
set -e

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
  echo "=== 🐳 ==="
  echo "Welcome to installation helper of Ledokku"
  echo "=== 🐳 ==="

  ensure-dokku

  # First we get the user ip so we can use it in the text we print later
  DOKKU_SSH_HOST=$(curl ifconfig.co)

  echo "=== 🐳 ==="
  echo "In your browser open https://github.com/settings/developers and click on the \"New OAuth App\" button."
  echo
  echo "Add a name, a homepage url, and in the field \"Authorization callback URL\" set the value to \"http://"$DOKKU_SSH_HOST":4000\"."
  echo
  echo "Then click the \"Register application\" button. You should now be able to see the client id and client secret of the app."
  echo "=== 🐳 ==="

  # Get variables from the user
  read -p "Enter Your Github Client ID: " GITHUB_CLIENT_ID
  read -p "Enter Your Github Client Secret: " GITHUB_CLIENT_SECRET

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
  dokku config:set ledokku GITHUB_CLIENT_ID="${GITHUB_CLIENT_ID}"
  dokku config:set ledokku GITHUB_CLIENT_SECRET="${GITHUB_CLIENT_SECRET}"
  dokku config:set ledokku DOKKU_SSH_HOST="${DOKKU_SSH_HOST}"
  dokku config:set ledokku JWT_SECRET="${JWT_SECRET}"

  # Now it's finally time to install ledokku
  echo "=> Installation"
  docker pull ledokku/ledokku:0.1.0
  docker tag ledokku/ledokku:0.1.0 dokku/ledokku:0.1.0
  dokku tags:deploy ledokku 0.1.0

  echo "=== 🐳 ==="
  echo "Installation succesful"
  echo "Open you server ip in your browser with the port 4000"
  echo "http://${DOKKU_SSH_HOST}:4000"
  echo "=== 🐳 ==="
}

main
