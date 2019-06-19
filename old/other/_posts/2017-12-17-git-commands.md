---
layout: post
title: Git Commands
tags: [git]
---

1. Rename local branch (not yet pushed to origin)
    - `git branch -m new-name` From same branch 

1. Rename local and remote branch (already pushed to origin) 
    - `git branch -m new-name` From same branch 
    - `git push origin :old-name new-name` Delete old-name remote branch and push new-name local branch
    - `git push origin -u new-name` reset upstream branch for new-name local branch
    
1. Set upstream branch for local branch before doing a push with `git push origin -u BRANCH`
    - `git branch --set-upstream-to origin/BRANCH` 

1.  Check the remotes
    - `git remote -v`

1. Change url for remote origin 
    - `git remote set-url origin https://REPOSITORY-URL.git`
