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

function sysInfo() 
{
  # Finding Information about your device
  ## Basic VPS info
  ## Should exist in every script
  IP="$(ifconfig | grep broadcast | awk '{print $2}')"
  OS=$( $(compgen -G "/etc/*release" > /dev/null) && cat /etc/*release | grep ^NAME | tr -d 'NAME="' || echo "${OSTYPE//[0-9.]/}")
}

function check-whiptail() 
{
  # Checking if whiptail is available or not
  if which whiptail >/dev/null; then
      echo "${GREEN}whiptail exists${END}"
      # Continue the script
  else
      echo "${RED}whiptail does not exist${END}"
      echo "Install whiptail and re-run the script, your OS is ${OS}"
      exit
      # As I already know the OS, I can also automate this process, but will save it for later.
      # This is just a matter of finiding all the possible OS people might use and writing a if statement.
  fi
}

function check-root()
{
  #Check root and if not root take permissions (Some providers doesnot support passwordless sudo)
  ## It is always better to do this.
  ## We will not face any further issues, during any sort of compulsory sudo commands; like the case for installing plugins in Dokku or Giving permissions to our scripts
  if [ "$(whoami)" == "root" ] ; then
      echo "${YELLOW}Nice you are running the script as root!${END}"
  else
      echo "${RED}Please! Run the script with root access${END}, without root access I cannot create plugins in Dokku"
      exit
  fi
}

function systemUpdate {

  # Updating and Upgrading system
  ## If dokku was installed, it will be automatically updated to the latest version
  ## Staying up to date is always good
  if (whiptail --title "Update and Upgrade System " --yes-button "Yes" --no-button "Skip"  --yesno "Do you wish to Update packges and Upgrade your system?" 10 60) then
      echo "You chose to update your system"
      # Update and skip to next step
      echo "${YELLOW}Updating System${END}"
      sudo dpkg --configure -a
      sudo apt -y --purge autoremove
      sudo apt install -f
      sudo apt -y update
      wait
      echo "${YELLOW}Upgrading System${END}"
      sudo apt -y upgrade
      sudo apt -y autoclean
      sudo apt -y --purge autoremove &
      process_id=$!
      wait $process_id
      echo "Exit status: $?"
  else
      echo "${YELLOW}You chose to skip.${END}"
      # Should skip to next step
  fi
}

function dokku()
{
  # Confirming the existance of Dokku
  ## If exists, promt for update
  ## If not exits Let him download.
  if which dokku >/dev/null; then
      echo "${GREEN}Dokku Exists${END}"
      # Promt for update
      if (whiptail --title "Updating Dokku" --yes-button "Update" --no-button "Skip"  --yesno "Would you like to update your Dokku?" 10 60) then
          echo "${YELLOW}You chose Update.${END}"
          # Update Dokku
          echo "${YELLOW}Upgrading Dokku${END}"
          sudo apt-get -y update -qq
          wait
          sudo apt-get -qq -y --no-install-recommends install dokku herokuish sshcommand plugn gliderlabs-sigil dokku-update dokku-event-listener
          wait
          sudo apt -y upgrade &
          process_id=$!
          wait $process_id
          echo "Exit status: $?"
          echo "${YELLOW}Now you have the latest Version of Dokku${END}"
          # Dokku Updated
      else
          echo "${Yellow}You chose to skip dokku updates.${END}"
          # Dokku Update skipped
      fi
  else
      echo "${RED}Dokku does not exist${END}"
      # Show messagebox and make it mandatory to download and install dokku
      whiptail --title "Unable to Detect Dokku" --msgbox "If you want to insatll your app using t2d, it is madatory to install Dokku. So, I would like to install Dokku on behalf of you." 10 60
      wait
      echo "${YELLOW}Downloading Dokku from its Official Repository${END}"
      wget https://raw.githubusercontent.com/dokku/dokku/v0.24.10/bootstrap.sh
      wait
      sudo DOKKU_TAG=v0.24.10 bash bootstrap.sh &
      process_id=$!
      wait $process_id
      echo "Exit status: $?"
      whiptail --title "Confirm Dokku Installation" --msgbox "Before continuing forward, verify Dokku installation by visiting your IP address in your browser.\n\nOne among these IP adresses is your Public IP Address:\n${IP}" 20 60
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
