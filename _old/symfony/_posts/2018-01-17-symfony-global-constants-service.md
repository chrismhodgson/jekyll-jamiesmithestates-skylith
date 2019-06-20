---
layout: post
title: Global Constants in Symfony
summary: Setting up a service to store global constants in Symfony.
tags: [constants]
featured: true
links:
    - {link: "http://symfony.com/doc/current/components/console/helpers/questionhelper.html", 
    label: "Symfony.com: Console Question Helper"}
---

Useful for storing global constants that will not change between environments and therefore should not really 
be held in the `parameters.yml`

#### Constants 

```php
<?php
namespace AppBundle\Util;

class Constants
{
    public function getDateFormat() 
    {
        return 'd/m/Y, h:i';
    }
}

```

#### ConstantsAwareTrait 
A trait to allow setting of the constants property.  

```php
<?php
namespace AppBundle\Util;

trait ConstantsAwareTrait
{
    /**
     * The Constants instance.
     *
     * @var Constants
     */
    public $constants;

    /**
     * Sets Constants.
     *
     * @param Constants $constants
     */
    public function setConstants(Constants $constants)
    {
        $this->constants = $constants;
    }
}
```

#### DateFormatter
An example class that could use the constants.

```php
<?php
namespace AppBundle\Util;

class DateFormatter
{
    use ConstantsAwareTrait;
    
    public function getFormattedDate(int $timestamp)
    {
        return date($timestamp, $this->constants->getDateFormat());
    }
}
```

#### Service Configuration
```yaml
# app/services.yml
services:
  app.util.date_formatter:
    class: AppBundle\Util\DateFormatter
    calls:
      - ['setConstants', ['@app.constants']]
```