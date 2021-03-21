---
title: Hello Ledokku, goodbye Her*ku
author: Arturs Kirtovskis
author_title: Team Ledokku
author_url: https://twitter.com/Akirtovskis
author_image_url: https://avatars.githubusercontent.com/u/25903618?s=460&u=b6e76e88e2ae95040720e229a53fbdbbc22289c8&v=4
tags:
  [
    dokku,
    ledokku,
    deployments,
    heroku,
    open-source,
    OSS,
    gitlab,
    github,
    dockerhub,
  ]
description: Meet Ledokku, amazing deployment UI built on top of Dokku
image: https://www.ledokku.com/img/twitterCardImage.png
hide_table_of_contents: false
---

![Ledokku-Dashboard](https://www.ledokku.com/img/dashboard1.png)

### Meet Ledokku

Ledokku is UI built on top of an amazing open source PaaS project called Dokku. For those who are not familiar, Dokku is a docker powered heroku-like tool that is using herokuish and when you deploy your app via Dokku, essential functionality is very similar to one used in Heroku.

Initially around one year ago it started as a hackathon project when Leo proposed that we build a UI on top of Dokku. Couple of wine glasses later I kind of as a joke mentioned : "Should we name this thing Ledokku?". Some minutes passed and it started to actually click, make sense and had unoccupied SEO, so it became Ledokku. Totally unrelated Leo is from 🇫🇷 . We didn't win hackathon, but nevertheless decided to keep going with the project on our spare time.

<!--truncate-->

### Easily deploy app from your git repository

Today is a massive day for us as we are going live with git deployment flow that will allow you to easily deploy apps from your public repos in any of these languages : **Javascript, Go, Ruby, PHP, Python, Java, Scala, Clojure** and link them with any of these databases: **PostgreSQL , MongoDB, MySQL, Redis.**

### Automatic redeployments and zero downtime

App is deployed and you are still working on it? No problem, with github webhooks we will be able to listen to changes made in your project and therefore trigger redeployment once something is pushed to your main branch. Thanks to Dokku redeployment won't affect currently deployed app and you will be guaranteed zero downtime.

### Low cost and complete control

Instead of using Heroku, you will be Heroku. You will have a complete control of your apps. It will require a short initial configuration, but that is well described in our [**onboarding guides**](https://www.ledokku.com/docs/getting-started). In terms of money you will be saving heaps as you only need to take care of the server costs and there are no additional fees for let's say adding database to your app.

In case you don't have Digital Ocean account you can register through [**this link**](https://m.do.co/c/35f78321cb42) and have $100 of free credit that will cover your app deployments and hosting for a good while at no cost.

### Shaping the future of deployments

We are here to stay and this, while big step, is just a beginning. Deployments from private repos, cleaner UI, deployments from Gitlab, Dockerhub, custom domain handling and many more exciting features are coming soon.

Take part in shaping the future and follow us on [**Twitter**](https://twitter.com/ledokku), join our [**Discord**](https://discord.gg/v76vY2YaKp) or open an issue on our [**Github**](https://github.com/ledokku/ledokku) repo. Any and all of the feedback will be highly appreciated.

Stay tuned and happy deployments.

### And before you go, couple more shots of our slick UI

Create app view

![Ledokku-Create-App-View](https://www.ledokku.com/img/createApp.png)

App logs view

![Ledokku-Logs](https://www.ledokku.com/img/appLogs.png)
