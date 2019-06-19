---
layout: post
title: Docker and docker-compose commands
tags: [docker-compose, docker, docker-sync]
links:
    - {link: "https://docs.docker.com/engine/reference/commandline/docker/#child-commands", 
    label: "docs.docker.com: Docker child commands"}            
    - {link: "https://docs.docker.com/engine/reference/commandline/cli/", 
    label: "docs.docker.com: Docker CLI"}
    - {link: "https://docs.docker.com/compose/reference/overview/", 
    label: "docs.docker.com: Docker-compose CLI"}
    - {link: "https://www.digitalocean.com/community/tutorials/how-to-remove-docker-images-containers-and-volumes", 
    label: "digitalocean.com: How To Remove Docker Images, Containers, and Volumes"}        
created: 2018-01-04
date: 2018-06-01
---

#### Docker Compose
- start the containers (in detached mode) `docker-compose up -d` 
- start and build containers - `docker-compose up -d --build`
- stop containers - `docker-compose stop`
- get a list of services `docker-compose ps --services`
- start interactive bash shell in a service `docker-compose exec SERVICE_NAME bash`
- run a command in a service tha isnt running - `docker-compose run SERVICE_NAME COMMAND_NAME`

#### Docker 
- list all containers (including stopped) - `docker ps -a` 
- remove all containers (stop if running) - `docker container rm -f $(docker container ls -a -q)` 
- remove all images (stop if running) - `docker image rm -f $(docker image ls -a -q)`

### Docker Sync
- install unison (OSX) `docker logout && brew install unison`   
- start docker-sync `docker-sync-stack start`. 
