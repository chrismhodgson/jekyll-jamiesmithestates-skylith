---
layout: post
title: Symfony Command Line Options 
summary: Some useful command line options for the symfony console.
tags: [console, cheatsheet]
featured: true
links:
    - {link: "http://symfony.com/app.php/doc/3.3/components/console/usage.html", 
    label: "Symfony.com: Console commands, shortcuts and built-in commands"}
---

Some useful command line options for the symfony console.

#### Doctrine 
- Generate CRUD controller based on doctrine entity `bin/console generate:doctrine:crud --entity=AppBundle:Story --format=annotation --with-write --no-interaction`
- Generate Doctrine Entity `bin/console generate:doctrine:entity --entity=AppBundle:Story`  
- Generate Getters and Setters `bin/console doctrine:generate:entities —-no-backup AppBundle/Entity/Story`
- Drop Database using config `bin/console doctrine:database::drop —force`

#### Doctrine Migrations 
- `bin/console doctrine:migrations:diff`
- `bin/console doctrine:migrations:migrate`
- `bin/console doctrine:migrations:execute FIXTURE —down`

#### Fixtures 

- http://symfony.com/doc/current/bundles/DoctrineFixturesBundle/index.html
- Install Fixtures `composer require --dev doctrine/doctrine-fixtures-bundle`
- Run fixtures (without purging tables first)  `bin/console doctrine:fixtures:load —-append —fixtures=<dir>`

#### Routes
- Search for a route `bin/console debug:router | grep <string>`
- Find the route for a url `bin/console router:match /story/index`
- Get info about a route `bin/console debug:router article_show`

#### Twig
- Check syntax of a twig template `bin/console lint:twig app/Resources/views/story/index.html.twig`

#### Cache
- Clear the cache `bin/console cache:clear --env=prod --no-debug`

#### Unit tests
- Run a particular test `bin/phpunit --filter MyTest`
- Take phpunit from the app folder `bin/phpunit -c app`

#### Install & Configuration
- Create New project `symfony new PROJECT_NAME lts`
- Start PHP Web Server `bin/console server:run`
- Check the config `bin/console config:dump-reference framework`
- Check security `bin/console security:check`
- Get a list of services available `bin/console debug:container |grep form.factory`