---
id: what-is-ledokku
title: What is Ledokku?
---

### Meet Ledokku

Ledokku is a beautiful web dashboard powered by **dokku**. With Ledokku you will be able to deploy apps in most popular programming languages, link them to most popular databases and all that with almost zero configuration from your side. Apart from all these amazing features it will also save you money along the way.

### What is dokku?

Dokku is Docker-powered Heroku-like tool that allows you to deploy complex applications by simply pushing it via Git repository. Behind the scenes it runs on **herokuish**, which essentially is emulating same functionalities that you are using when you deploy your apps on Heroku. As it supports all the Heroku buildpacks, it is fairly easy for you to transfer your Heroku apps to Ledokku.

### How does it work?

Herokuish is looking for files that define the apps structure and then figures out which language is used and what dependencies are necessary for this program to run. Only thing that you will need to provide is a GitHub link of a project in one of the languages listed below.

As of now you can build apps in these languages : **Javascript**, **Go**, **Ruby**, **PHP**, **Python**, **Java**, **Scala**, **Clojure**
and link them to any of these databases : **PostgreSQL** , **MongoDB**, **MySQL**, **Redis**.

### What about servers?

First iteration of Ledokku won't manage any of your servers, which means to get Ledokku running you will have to spin up server yourself or follow one of our guides if you need any help. However in future we plan to handle servers from most popupular cloud providers as well and make your deployment process as seamless as your morning tea preparation.
