---
layout: post
title: Stored SQL function  
summary: Using a stored function to generate an alphanumeric sequence.
tags: [sql, stored function]
featured: true
---

#### Stored Function

```sql
DROP FUNCTION IF EXISTS generateSequence;
DELIMITER //
CREATE FUNCTION generateSequence (vname VARCHAR(30), vprefix VARCHAR(30), vpadding INT)
  RETURNS VARCHAR(50)
BEGIN
   UPDATE plt_sequence SET
     prefix = (@prefix := IF(next < end, prefix, vprefix)),
     next = (@next := IF(next < end, next, 0)) + increment
     WHERE name = vname;
   IF @next = 0 THEN
     SET @next := 1;
   END IF;
   RETURN CONCAT(@prefix, LPAD(@next, vpadding, '0'));
END
//
DELIMITER ;
```

#### Sequence Table Schema and Data 
 
```sql
DROP TABLE IF EXISTS `plt_sequence`;
CREATE TABLE `plt_sequence` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `prefix` varchar(30) NOT NULL,
  `next` int(11) UNSIGNED NOT NULL,
  `end` int(11) UNSIGNED NOT NULL,
  `increment` int(11) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`name`)
);

INSERT INTO plt_sequence (name, prefix, next, end, increment)
VALUES ('product_model_code', 'CLW', 1, 10000, 1);
```

#### ProductModelCodeHelper

```php
<?php

namespace AppBundle\Helper;

use AppBundle\Entity\Sequence;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Query\ResultSetMapping;
use Exception;

class ProductModelCodeHelper
{
    const SEQUENCE_NAME = 'product_model_code';
    const SEQUENCE_PADDING = 4;

    /**
     * @var EntityManager
     */
    private $entityManager;

    public function __construct(EntityManager $em)
    {
        $this->entityManager = $em;
    }

    /**
     * @return string
     * @throws Exception
     */
    public function create(): string
    {
        try {
            return $this->getNextModelCode();
        } catch (Exception $e) {
            throw new Exception('Failed to get next Product Model code - ' . $e->getMessage());
        }
    }

    /**
     * @return string
     * @throws Exception
     */
    private function getNextModelCode(): string
    {
        $nextPrefix = $this->getCurrentModelPrefix();
        do {
            $isPrefixUsed = $this->isPrefixAlreadyUsed(++$nextPrefix);
        } while ($isPrefixUsed == true);

        if (!$code = $this->generateSequence($nextPrefix)) {
            throw new Exception('next sequence is blank.');
        }
        return $code;
    }

    /**
     * @return string
     * @throws Exception
     */
    private function getCurrentModelPrefix(): string
    {
        /** @var Sequence $sequence */
        if (!$sequence = $this->entityManager->getRepository('AppBundle:Sequence')->findOneBy([
            'name' => self::SEQUENCE_NAME
        ])) {
            throw new Exception('prefix not found.');
        }
        return $sequence->getPrefix();
    }

    /**
     * @param string $nextPrefix
     * @return bool
     */
    private function isPrefixAlreadyUsed(string $nextPrefix): bool
    {
        return (bool)$this->entityManager->getRepository('AppBundle:ProductModelPrefixUsed')->findOneBy([
            'prefix' => $nextPrefix
        ]);
    }

    /**
     * @param string $nextPrefix
     * @return string|null
     * @throws \Doctrine\ORM\NoResultException
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    private function generateSequence(string $nextPrefix): ?string
    {
        $mapping = (new ResultSetMapping())->addScalarResult('result', 'result');
        $sql = 'select generateSequence(:sequenceName, :nextPrefix, :padding) as result';
        $query = $this->entityManager->createNativeQuery($sql, $mapping);
        $query->setParameter('sequenceName', self::SEQUENCE_NAME);
        $query->setParameter('nextPrefix', $nextPrefix);
        $query->setParameter('padding', self::SEQUENCE_PADDING);

        return $query->getSingleScalarResult();
    }
}
```

#### Sequence Entity

```php
<?php
namespace AppBundle\Entity;

class Sequence
{
    /**
     * @var int
     */
    private $id;

    /**
     * @var string
     */
    private $name;

    /**
     * @var string
     */
    private $prefix;

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @return string
     */
    public function getPrefix(): string
    {
        return $this->prefix;
    }
}
```

#### ProductModelCodeHelperTest

```php

namespace Tests\AppBundle\Helper;

use AppBundle\Helper\ProductModelCodeHelper;
use AppBundle\Entity\Sequence;
use Doctrine\ORM\AbstractQuery;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityRepository;
use PHPUnit\Framework\TestCase;

class ProductModelCodeHelperTest extends TestCase
{
    /** @var EntityManager|\PHPUnit_Framework_MockObject_MockObject */
    private $entityManager;

    /** @var EntityRepository|\PHPUnit_Framework_MockObject_MockObject */
    private $sequenceRepository;

    /** @var EntityRepository|\PHPUnit_Framework_MockObject_MockObject */
    private $productModelPrefixedRepository;

    /** @var Sequence|\PHPUnit_Framework_MockObject_MockObject */
    private $sequence;

    /** @var AbstractQuery|\PHPUnit_Framework_MockObject_MockObject */
    private $query;

    /** @var ProductModelCodeHelper|\PHPUnit_Framework_MockObject_MockObject */
    private $sut;

    protected function setUp()
    {
        $this->entityManager = $this->createMock(EntityManager::class);
        $this->sequenceRepository = $this->createMock(EntityRepository::class);
        $this->productModelPrefixedRepository = $this->createMock(EntityRepository::class);
        $this->sequence = $this->createMock(Sequence::class);

        $this->query = $this->getMockBuilder('Doctrine\ORM\AbstractQuery')->disableOriginalConstructor()
            ->setMethods(['setParameter', 'getSingleScalarResult'])
            ->getMockForAbstractClass();

        $this->sut = new ProductModelCodeHelper($this->entityManager);
    }

    public function testShouldCreateCode()
    {
        $expected = 'new product model code';

        $this->entityManager->expects($this->exactly(3))->method('getRepository')
            ->withConsecutive(['AppBundle:Sequence'], ['AppBundle:ProductModelPrefixUsed'], ['AppBundle:ProductModelPrefixUsed'])
            ->willReturnOnConsecutiveCalls(
                $this->sequenceRepository,
                $this->productModelPrefixedRepository,
                $this->productModelPrefixedRepository
            );

        //getCurrentModelPrefix
        $this->sequenceRepository->expects($this->once())->method('findOneBy')->willReturn($this->sequence);

        $this->sequence->expects($this->once())->method('getPrefix')->willReturn('prefix');

        //isPrefixAlreadyUsed
        $this->productModelPrefixedRepository->expects($this->exactly(2))->method('findOneBy')
            ->willReturn(true, false);

        $this->entityManager->expects($this->once())->method('createNativeQuery')->willReturn($this->query);

        $this->query->expects($this->once())->method('getSingleScalarResult')->willReturn($expected);

        $this->assertSame($expected, $this->sut->create());
    }

    /**
     * @expectedException \Exception
     * @expectedExceptionMessage Failed to get next Product Model code - prefix not found.
     */
    public function testShouldNotGetCurrentModelPrefix()
    {
        $this->entityManager->expects($this->once())->method('getRepository')
            ->with('AppBundle:Sequence')
            ->willReturn($this->sequenceRepository);

        $this->sequenceRepository->expects($this->once())->method('findOneBy')->willReturn(null);

        $this->sut->create();
    }

    /**
     * @expectedException \Exception
     * @expectedExceptionMessage Failed to get next Product Model code - next sequence is blank.
     */
    public function testShouldNotGenerateSequence()
    {
        $this->entityManager->expects($this->exactly(2))->method('getRepository')
            ->withConsecutive(['AppBundle:Sequence'], ['AppBundle:ProductModelPrefixUsed'])
            ->willReturnOnConsecutiveCalls($this->sequenceRepository, $this->productModelPrefixedRepository);

        //getCurrentModelPrefix
        $this->sequenceRepository->expects($this->once())->method('findOneBy')->willReturn($this->sequence);

        $this->sequence->expects($this->once())->method('getPrefix')->willReturn('prefix');

        //isPrefixAlreadyUsed
        $this->productModelPrefixedRepository->expects($this->once())->method('findOneBy')
            ->willReturnOnConsecutiveCalls(false);

        $this->entityManager->expects($this->once())->method('createNativeQuery')->willReturn($this->query);

        $this->query->expects($this->once())->method('getSingleScalarResult')->willReturn(null);

        $this->sut->create();
    }
}
```