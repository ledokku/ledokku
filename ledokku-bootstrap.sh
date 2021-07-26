#!/bin/bash

# This script is used to configure the essentials of ledokku.
## 1 => Check whether the program/application, "Whiptails" exists or not.
## 2 => Making sure that the script is running with root permissions.
## 3 => Update and Upgrade the VPS.
## 4 => Check whether the program/application, "Dokku" was Installed or not.
## 5 => Upgrading dokku to the latest version.
## 6 => Check whether the Plugins are installed or not (Redis, Postgres)
## 7 => Install Redis and Postgres, if they were not installed
## 8 => Install ledokku
## ? => Update Script (Will be added later)

set -e

function define-colors {

  # Using tput will eliminate the usage of "-e" in echo, and can be used anywhere
  ## Color Palet
  ## Should exist in every script
  RED="$(tput setaf 1)" # ${RED}
  GREEN="$(tput setaf 2)" # ${GREEN}
  YELLOW="$(tput setaf 3)" # ${YELLOW}
  BLUE="$(tput setaf 123)" # ${BLUE}
  END="$(tput setaf 7)" # ${END
}

function system-info() {
  
  # Finding Information about the server/VPS
  ## Basic VPS info
  DOKKU_SSH_HOST=$(curl -4 ifconfig.co)
  OS=$( $(compgen -G "/etc/*release" > /dev/null) && cat /etc/*release | grep ^NAME | tr -d 'NAME="' || echo "${OSTYPE//[0-9.]/}")

  ## Dokku Configuration Variables
  LATEST_DOKKU_VERSION="0.24.10"
  MINIMUM_DOKKU_VERSION="0.24.0"
}

function check-whiptail() {
  
  # Checking if whiptail is available or not
  if which whiptail >/dev/null; then
      echo "${GREEN}whiptail exists${END}"
      # Script Continues
  else
      echo "${RED}whiptail does not exist${END}"
      echo "Install whiptail and re-run the script, your OS is ${OS}"
      exit
      # As I already know the OS, I can also automate this process, but will save it for later.
      # This is just a matter of finding all the possible OS people might use and writing an if statement.
  fi
}

function check-root() {
  
  # Check root and if not root take permissions (Some providers does not support password less sudo)
  ## It is always better to do this.
  ## We will not face any further issues, during any sort of compulsory sudo commands; like the case for installing plugins in Dokku or Giving permissions to our scripts
  if [ "$(whoami)" == "root" ] ; then
      echo "${YELLOW}Nice you are running the script as root!${END}"
      # Script Continues
  else
      echo "${RED}Please! Run the script with root access${END}, without root access I cannot create plugins in Dokku"
      exit
      # End of Script
  fi
}

function system-update {

  # Updating and Upgrading system
  ## If dokku was installed, it will be automatically updated to the latest version
  ## Staying up to date is always good
  if (whiptail --title "Update and Upgrade System " --yes-button "Yes" --no-button "Skip"  --yesno "Do you wish to Update and Upgrade your system?" 10 60) then
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

function ensure-dokku() {
  
  # Confirming the existence of Dokku
  ## If exists => check if existing and latest dokku versions are same => If same version => Continue to next step
  ###  In case of different dokku versions => Prompt a (warning & dokku upgrade) dialog box (Now it is up to the user to update or skip)
  ## If dokku does not exits, take permission to download Dokku.
  if which dokku >/dev/null; then
      echo "${GREEN}Dokku Exists${END}"
      # Checking Dokku version and comparing it with the latest Version
      # In case of version changes in dokku, we need to change this variable: LATEST_DOKKU_VERSION.
      # We can also rename the variable => LATEST_DOKKU_VERSION to PREFERRED_DOKKU_VERSION
      
      EXISTING_DOKKU_VERSION="$(dokku version | awk '{print $3}')"

      if [ "$( echo -e "${MINIMUM_DOKKU_VERSION}\\n${LATEST_DOKKU_VERSION}\\n${EXISTING_DOKKU_VERSION}" | sort --sort=version | head -2 | tail -1)" == ${EXISTING_DOKKU_VERSION} ];
      then
        echo "Your dokku version is ${EXISTING_DOKKU_VERSION}, and it is compatible with ledokku "
        if [[ "${EXISTING_DOKKU_VERSION}" == "${LATEST_DOKKU_VERSION}" ]];
        then
          # Continue the script
          echo "${GREEN}Awesome! You have the latest dokku version${END}"
        else 
          # Prompt upgrade warning (upgrade or skip)
          whiptail --title "Warning !!" --msgbox "Read carefully before proceeding:\n\nYou are currently using dokku version: ${EXISTING_DOKKU_VERSION} but the latest dokku version was: ${LATEST_DOKKU_VERSION}\n\nIn the next dialog box, you can upgrade your dokku or skip to ledokku installation \n\nFor more info check the dokku CHANGELOG before doing the upgrade: https://github.com/dokku/dokku/releases" 20 60
          # Prompt for upgrade
          if (whiptail --title "Upgrading Dokku" --yes-button "Upgrade" --no-button "Skip"  --yesno "Would you like to upgrade your Dokku?" 10 60) then
              echo "${YELLOW}You chose Upgrade.${END}"
              # Upgrade Dokku
              echo "${YELLOW}Upgrading Dokku${END}"
              sudo apt-get -y update -qq
              wait
              sudo apt-get -qq -y --no-install-recommends install dokku herokuish sshcommand plugn gliderlabs-sigil dokku-update dokku-event-listener
              wait
              sudo apt -y upgrade &
              process_id=$!
              wait $process_id
              echo "Exit status: $?"
              echo "${YELLOW}Upgraded to ${GREEN} $LATEST_DOKKU_VERSION ${END}"
              # Dokku Updated
          else
              echo "${YELLOW}You chose to skip dokku upgrades.${END}"
              # Dokku Update skipped
          fi
        fi
      else
        echo "Your dokku version is ${EXISTING_DOKKU_VERSION} => and for ledokku compatibility dokku version should be between ${MINIMUM_DOKKU_VERSION} and ${LATEST_DOKKU_VERSION}"
        # Prompt upgrade to latest dokku version (upgrade or exit)
        whiptail --title "Warning !!" --msgbox "Read carefully before proceeding:\n\nYou are currently using dokku version: $EXISTING_DOKKU_VERSION, which is incompatible with ledokku.\n\nWould you like to install the latest dokku version $LATEST_DOKKU_VERSION?\n\nIn the next dialog box, you can upgrade your dokku or exit the ledokku installation \n\nFor more info check the dokku CHANGELOG before doing the upgrade: https://github.com/dokku/dokku/releases" 20 60
        # Prompt for upgrade
        if (whiptail --title "Upgrading Dokku" --yes-button "Upgrade" --no-button "Exit"  --yesno "Would you like to upgrade your Dokku?" 10 60) then
            echo "${YELLOW}You chose Upgrade.${END}"
            # Upgrade Dokku
            echo "${YELLOW}Upgrading Dokku${END}"
            sudo apt-get -y update -qq
            wait
            sudo apt-get -qq -y --no-install-recommends install dokku herokuish sshcommand plugn gliderlabs-sigil dokku-update dokku-event-listener
            wait
            sudo apt -y upgrade &
            process_id=$!
            wait $process_id
            echo "Exit status: $?"
            echo "${YELLOW}Upgraded to ${GREEN} $LATEST_DOKKU_VERSION ${END}"
            # Dokku Updated
        else
            echo "${RED}You chose to skip dokku upgrades and exit ledokku installation.${END}"
            exit
            # ledokku script ended
            # This way we can prevent installing ledokku in non-compatible dokku versions.
        fi
      fi
  else
      echo "${RED}Dokku does not exist${END}"
      # Show message box and make it mandatory to download and install dokku
      system-update
      wait
      whiptail --title "Unable to detect Dokku" --msgbox "If you want to install your app using ledokku, it is mandatory to install Dokku. So, I would like to install Dokku on behalf of you." 10 60
      wait
      echo "${YELLOW}Downloading Dokku from its Official Repository${END}"
      wget https://raw.githubusercontent.com/dokku/dokku/v${LATEST_DOKKU_VERSION}/bootstrap.sh
      wait
      sudo DOKKU_TAG=v${LATEST_DOKKU_VERSION} bash bootstrap.sh &
      process_id=$!
      wait $process_id
      echo "Exit status: $?"
      whiptail --title "Confirm Dokku Installation" --msgbox "Before continuing forward, verify Dokku installation by visiting your IP address in your browser.\n\nVisit this IP Address:${DOKKU_SSH_HOST} in your browser\n" 20 60
  fi
}

# Check if dokku redis plugin is installed and otherwise install it
function install-redis() {
  if sudo dokku plugin:installed redis; then
    echo "=> ${GREEN}Redis plugin already installed skipping${END}"
  else
    echo "=> ${YELLOW}Installing redis plugin${END}"
    sudo dokku plugin:install https://github.com/dokku/dokku-redis.git redis
  fi
}

# Check if dokku postgres plugin is installed and otherwise install it
function install-postgres() {
  if sudo dokku plugin:installed postgres; then
    echo "=> ${GREEN}Postgres plugin already installed skipping${END}"
  else
    echo "=> ${YELLOW}Installing postgres plugin${END}"
    sudo dokku plugin:install https://github.com/dokku/dokku-postgres.git postgres
  fi
}

function main() {
  define-colors
  system-info
  check-whiptail
  check-root
  ensure-dokku

  # Set latest version or use the one provided by the user
  LEDOKKU_TAG=${LEDOKKU_TAG:-"0.7.0"}


  # First we create the app
  dokku apps:create ledokku

  # Create volume necessary for the ssh key
  echo "=> ${YELLOW}Creating volume${END}"
  mkdir /var/lib/dokku/data/storage/ledokku-ssh/
  chown dokku:dokku /var/lib/dokku/data/storage/ledokku-ssh/
  dokku storage:mount ledokku /var/lib/dokku/data/storage/ledokku-ssh/:/root/.ssh

  install-redis
  install-postgres

  # We create the required databases
  echo "=> ${YELLOW}Creating databases${END}"
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
  echo "=> ${YELLOW}Installing ledokku${END}"
  dokku git:from-image ledokku ledokku/ledokku:${LEDOKKU_TAG}

  # After app is deployed last step is to properly setup the ports
  dokku proxy:ports-add ledokku http:80:4000
  dokku proxy:ports-remove ledokku http:4000:4000

  echo "=== 🐳 ==="
  echo "${GREEN}Ledokku was successfully installed${END}"
  echo "Open you server ip in your browser"
  echo "http://${DOKKU_SSH_HOST}"
  echo "=== 🐳 ==="
}

main
