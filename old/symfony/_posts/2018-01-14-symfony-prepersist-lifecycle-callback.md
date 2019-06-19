---
layout: post
title: Pre-Persist Lifecycle Callbacks using Doctrine and Symfony  
summary: Using a prePersist lifecycleCallback to automatically save the created at date when the entity is persisted for the first time.
tags: [doctrine, lifecycleCallbacks]
featured: true
links:
    - {link: "http://symfony.com/doc/3.4/doctrine/lifecycle_callbacks.html", 
    label: "Symfony.com: How to work with LifeCycle Callbacks"}
    - {link: "http://symfony.com/doc/3.4/doctrine/event_listeners_subscribers.html", 
    label: "Symfony.com: Doctrine Event Listeners and Subscribers"}
    - {link: "http://docs.doctrine-project.org/projects/doctrine-orm/en/latest/reference/events.html", 
    label: "Doctrine-project.org: Events"}
---

Using a prePersist lifecycleCallback to automatically save the created at date when the entity is persisted for the first time.

#### Entity
The `beforeCreate()` method will be called before the EntityManager persists the object. 
This event is only triggered on initial persist of an entity (i.e. it does not trigger on future updates).

 ```php
<?php
namespace AppBundle\Entity;

use DateTime;

class SqsMessage
{
    /**
     * @var integer
     */
    private $id;
    
    /**
     * @var string
     */
    private $message;
    
    /**
     * @var DateTime
     */
    private $createdAt;

    public function beforeCreate(): void
    {
        $this->createdAt = new DateTime();
    }
 
    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }
 
    /**
     * @return null|string
     */
    public function getMessage(): ?string
    {
        return $this->message;
    }
 
    /**
     * @param int
     * @return self     
     */
    public function setMessage(string $message): self
    {
        $this->$message = $message;
        return self;
    }
     
    /**
     * @return Datetime
     */
    public function getCreatedAt(): DateTime
    {
        return $this->createdAt;
    }
}
```

#### Doctrine configuration 
```yaml
# src/AppBundle/Resources/config/doctrine/SqsMessage.orm.yml
AppBundle\Entity\SqsMessage:
  type: entity
  table: sqs_message
  options:
    comment: "Represents an Sqs Message"
  id:
    id: {type: integer, generator: {strategy: AUTO }}
  fields:
    message:
      {column: message, type: string}
    createdAt:
      {column: sent_at, type: datetime}
  lifecycleCallbacks:
    prePersist: [ beforeCreate ]
```
