---
layout: post
title: Upgrade Hyde theme from Jekyll 2 to 3
tags: [jekyll upgrade]
links:
    - {link: "https://jekyllrb.com/docs/upgrading/2-to-3/", 
    label: "jekyllrb.com: Upgrading from 2.x to 3.x"}        
---

#### Jekyll 3 Install 
`gem install jekyll`

note: if this returns that it `requires > ruby 2.0.11` then 
`rvm install ruby-[latest]`

#### Changes to make Hyde theme compatible with jekyll 3
1. _config.yml  

    - add line: `paginate_path: "page:num"`
    - add line: `plugins: [jekyll-paginate, jeyll-gist]`
    - remove line: `relative_permalinks: true`

1. `gem install jekyll-paginate redcarpet jekyll-gist`

1. `jekyll serve && open http://127.0.0.1:4000`

