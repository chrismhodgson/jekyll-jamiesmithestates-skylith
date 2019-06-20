---
layout: post
title: Using PostgreSQL with Symfony 4
summary: Setting up Symfony 4 to use Doctrine with PostgreSQL.
tags: [postgreSQL, symfony4]
featured: true
links:
    - {link: "https://gist.github.com/Kartones/dd3ff5ec5ea238d4c546", 
    label: "gist.github.com: Postgres cheatsheet"}
    - {link: "https://www.doctrine-project.org/projects/doctrine-dbal/en/2.7/reference/configuration.html", 
    label: "doctrine-project.org: Doctrine configuration"}
    - {link: "https://www.codementor.io/engineerapart/getting-started-with-postgresql-on-mac-osx-are8jcopb#iii-getting-started", 
    label: "codementor.io: Getting started with PostgreSQL on Mac OSX"}
    - {link: "https://www.postgresql.org/about/", 
    label: "postgresql.org: About PostgreSQL"}
---

1. Install on OSX with Homebrew
    - `brew install postgresql`
    - `postgres -V` to see the version  

1. Add doctrine and doctrine migration 
    - `composer require doctrine/doctrine-bundle` 
    
1. Edit `config/doctrine.yaml` and replace the default mysql settings in `doctrine/dbal` section as follows
```yaml
doctrine:
   dbal:
       driver: 'pdo_pgsql'
       charset: utf8
```
1. Edit `DATABASE_URL` in `.env` and replace the default mysql settings as follows: 
    - start with `pgsql` driver
    - use port `5432`
    - change the database user to one which exists (tip: postgress will create a user matching your logged in user)

1. Create the database `bin/console doctrine:database:create` 
