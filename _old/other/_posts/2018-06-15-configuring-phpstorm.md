---
layout: post
title: Configuring PHPStorm 
summary: Configuring PHPStorm to use Xdebug, PHP and Symfony
tags: [xdebug, phpstorm]
links:
---

#### Setting the correct PHP version (per project)

- Go into `PhpStorm->Preferences->Plugins->Language & Framworks->PHP` and select this

#### Enabling the Symfony plugin (per project)

- Search for and Download symfony plugin by going to `PhpStorm->Preferences->Plugins->Browse Repositories`
- Restart PHPStorm
- On Restart PHPStorm should detect the symfony code and prompt you to enable the plugin for this project

#### Setting up Xdebug  

- For Xdebug to work you need to set up a server which can be done by going to `PhpStorm->Preferences->Plugins->Language & Framworks->PHP->servers`
- Click the plus icon
- Set the name to the same as the server name from the `IDE_CONFIG` config option in the `PHP.ini`. 
- Set the host to `localhost`
- Set the port to `8080` 
- Set debugger to `Xdebug`
- Check the box that says use path mappings
- Under where is says "Project Files" you will see the path to the root of the project. Next to it enter the `webroot` and press enter
