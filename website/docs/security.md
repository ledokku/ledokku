---
id: security
title: Security
---

# How is security handled

Security is super important to us and we try our best to think about all the possible scenarios when we add something to ledokku.
Currently the Graphql API we provide to the UI is secured by a JWT token (valid for 1 day). In order to get a new JWT token you first need to login via Github Oauth, this is how we verify the identity of the user. The JWT token is secured via a strong secret we generate when you run the installation bash script. You can change this secret at any time by changing the value of the `JWT_SECRET` env variable.

# Can anyone with a Github account access my ledokku admin?

In the current version of the project we only allow one user to signup, meaning that if another person tries to login via Github on your instance he will get rejected. Later we plan to let you invite more users and maybe do some team/role management for the apps.
As a workaround, you can use the `NUMBER_USERS_ALLOWED` env variable if you want to allow more users to access the ledokku admin.
