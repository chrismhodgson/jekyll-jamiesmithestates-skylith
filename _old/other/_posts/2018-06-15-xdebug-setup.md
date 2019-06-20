---
layout: post
title: Xdebug setup
summary: Configuring Xdebug with PHPStorm 
tags: [xdebug, phpstorm]
links:
---

#### Configuring PHPStorm to use Xdebug

- See [Configuring PHPStorm](/_old/other/2018/06/15/xdebug-setup/) 

#### Xdebug Chrome Extension Setup 

- Download [Xdebug chrome extension](https://chrome.google.com/webstore/detail/xdebug-helper/eadndfjplgieldjbigjakmdgkmoaaaoc?hl=en)
- Enable plugin
- Right click on the bug icon in the top right of Chrome and select options
- Under the section titled `IDE key` select `PHPStorm` from the drop down list


#### Configure PHP to use Xdebug 

- If not installed, install Xdebug with `pecl`
- Open `PHP.ini` and find the Xdebug section
- Set `ENABLED` to `1`
- Set `IDE_KEY` to `PHPSTORM`
- Set `REMOTE_HOST` to the local IP of your machine. 
Note: If you are using a mac with docker, you can avoid having to do this by setting this value to `docker.for.mac.host.internal`

