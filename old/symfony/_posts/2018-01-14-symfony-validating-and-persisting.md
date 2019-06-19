---
layout: post
title: Validation and persistence using Symfony and Doctrine 
summary: Validating an entity using Symfony and persisting it using Doctrine. 
tags: [validation, doctrine]
featured: true
links:
    - {link: "http://symfony.com/doc/3.4/validation.html", 
    label: "Symfony.com: Validation"}
    - {link: "http://docs.doctrine-project.org/projects/doctrine-orm/en/latest/reference/working-with-objects.html", 
    label: "Doctrine-project.org: Working with Objects"}
---
  
#### Publisher 
```php
<?php
# src/AppBundle/Publisher/SqsMessagePublisher.php

namespace AppBundle\Publisher;

use AppBundle\Entity\SqsMessage;
use Doctrine\ORM\EntityManager;
use Symfony\Component\Validator\ValidatorBuilderInterface;
use Exception;
use Throwable;

class SqsMessagePublisher
{
    /**
     * @var EntityManager
     */
    private $entityManager;

    /**
     * @var ValidatorBuilderInterface
     */
    private $builder;

    public function __construct(EntityManager $em, ValidatorBuilderInterface $builder)
    {
        $this->entityManager = $em;
        $this->builder = $builder;
    }

    /**
     * @param string $message 
     * @throws Exception
     */
    public function publish(string $message, SqsMesssage $sqsMessage)
    {
        $validator = $this->builder->getValidator();
        $this->entityManager->getConnection()->beginTransaction();
        try {
            $sqsMessage->setMessage($message);
            if ($errors = (string)$validator->validate($sqsMessage)) {
                throw new Exception($errors);
            }
            $this->entityManager->persist($sqsMessage);
            $this->entityManager->flush();
            $this->entityManager->getConnection()->commit();
        } catch (Throwable $e) {
            $this->entityManager->getConnection()->rollback();
            throw new Exception('Could not save SqsMessage ' . $e->getMessage());
        }
    }
}
```

#### Entity
 ```php
<?php
# src/AppBundle/Entity/SqsMessage.php

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
        return $this;
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

#### Doctrine entity config 
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

#### Symfony validation config
```yaml
# src/AppBundle/Resources/config/validation.yml
AppBundle\Entity\SqsMessage:
  properties:
    id:
      - Type: int
    message:
      - Type: string
    sentAt:
      - Type: datetime
```

#### MySQL table definition
```sql
DROP TABLE IF EXISTS `sqs_message`;
CREATE TABLE `sqs_message` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `message` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `created_at` (`created_at`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
```