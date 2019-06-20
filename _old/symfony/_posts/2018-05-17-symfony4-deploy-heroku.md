---
layout: post
title: Deploy Symfony 4 to Heroku
summary: Deploying a Symfony 4 app on Heroku cloud platform.
tags: [postgreSQL, symfony4, heroku]
featured: true
links:
    - {link: "http://www.orbitale.io/2018/01/05/deploy-a-symfony-flex-project-on-heroku.html", 
    label: "orbitale.io: Deploy a Symfony Flex project on Heroku"}
    - {link: "https://devcenter.heroku.com/articles/getting-started-with-symfony", 
    label: "devcenter.heroku.com: Getting started with Symfony on Heroku"}    
---

#### Install 

1. Install Heroku CLI
    - `https://cli-assets.heroku.com/branches/stable/heroku-osx.pkg`

1. Create a Heroku app (you will need an account)
    - `heroku login` 
    - `heroku create` 

1. Add PHP and postgreSQL buildpacks 
    - `heroku buildpacks:set heroku/php`
    - `heroku addons:create heroku-postgresql:hobby-dev`
    
1. Update `.env` and `doctrine.yaml` config to use postgreSQL    

1. Add doctrine migration as a composer compile script
```yaml
"scripts": {
        "compile": [
            "php bin/console doctrine:migrations:migrate"
        ]
    }
```    
    
1. Create symfony `APP_ENV` and `APP_SECRET` environment variables on Heroku  
    - `heroku config:set APP_ENV=prod APP_SECRET=YOUR SECRET`

1. Create a Procfile with the following dyno in it
    - `web: vendor/bin/heroku-php-nginx public/`

1. Clone / create git repo and push the changes to heroku
    - `git push heroku master`

1. Open the app on Heroku - `heroku open`


#### Useful commands 

1. Tail the logs - `heroku logs --tail`

1. Run an interactive shell - `heroku run bash`