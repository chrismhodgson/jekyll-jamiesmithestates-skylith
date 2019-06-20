---
layout: post
title: Years and Months to Months Symfony Transformer  
summary: Symfony transformer to convert between years and months entered via the form and months stored in the database.
tags: [transformer, form]
featured: true
links:
    - {link: "http://symfony.com/doc/3.3/form/data_transformers.html", 
    label: "Symfony.com: How to use Data Transformers"} 
    - {link: "https://ourcodeworld.com/articles/read/6/what-is-and-how-to-create-a-data-transformer-in-symfony2", 
    label: "OurCodeWorld.com: What is an how to create a data transformer in Symfony2"} 
---

Converts between years and months entered via the form and months stored in the database

#### MonthToYearMonthTransformer 
`Transforms` the database to form values and `reverse transforms` the form to database values.   

```php
<?php
namespace AppBundle\Form\DataTransformer;

use Symfony\Component\Form\DataTransformerInterface;

class MonthToYearMonthTransformer implements DataTransformerInterface
{
    /** @var string */
    private $yearsField;

    /** @var string */
    private $monthsField;

    public function __construct($yearsField, $monthsField)
    {
        $this->yearsField = $yearsField;
        $this->monthsField = $monthsField;
    }

    /**
     * Transforms from DB value to form value
     */
    public function transform($data)
    {
        $result = null;

        if (!is_null($data) && $data > 0) {
            $result = [
                $this->yearsField => (int) floor($data / 12),
                $this->monthsField => (int) ($data % 12)
            ];
        }

        return $result;
    }

    /**
     * Reverse transforms years/months to months (ie form -> DB values)
     */
    public function reverseTransform($data)
    {
        $result = null;

        if (is_array($data) && array_key_exists($this->yearsField, $data) &&
            array_key_exists($this->monthsField, $data)
        ) {
            $result = (int) ($data[$this->yearsField] > 0 ? 
                ($data[$this->yearsField] * 12) : 0) + $data[$this->monthsField];
        }

        return $result;
    }
}
```

#### MonthToYearMonthTransformerTest 
```php
<?php
namespace AppBundle\Form\DataTransformer;

use Symfony\Component\Form\DataTransformerInterface;

class MonthToYearMonthTransformerTest extends \PHPUnit_Framework_TestCase
{
    /** @var  MonthToYearMonthTransformer */
    private $sut;

    public function testShouldBeInstanceOfDataTransformerInterface()
    {
        $this->assertInstanceOf(DataTransformerInterface::class, $this->sut);
    }

    /**
     * test transform from db -> form values
     *
     * @dataProvider transformProvider
     */
    public function testTransform($monthsFromDatabase, $expectedYears, $expectedMonths)
    {
        $actual = $this->sut->transform($monthsFromDatabase);
        $this->assertSame($expectedYears, $actual['years']);
        $this->assertSame($expectedMonths, $actual['months']);
    }

    /**
     * 0 => months from database
     * 1 => expected years form value
     * 2 => expected months form value
     */
    public function transformProvider()
    {
        return [
            [0, null, null],
            [1, 0, 1],
            [2, 0, 2],
            [11, 0, 11],
            [13, 1, 1]
        ];
    }

    /**
     * test reverse transform form -> db values
     *
     * @dataProvider reverseTransformProvider
     */
    public function testReverseTransform($yearsFromForm, $monthsFromForm, $expected)
    {
        $actual = $this->sut->reverseTransform([
            'years' => $yearsFromForm, 
            'months' => $monthsFromForm
        ]);
        $this->assertSame($expected, $actual);
    }

    /**
     * 0 => years from form
     * 1 => months from form
     * 2 => expected months database value
     */
    public function reverseTransformProvider()
    {
        return [
            [0, 0, 0],
            [0, 1, 1],
            [0, 11, 11],
            [1, 1, 13]
        ];
    }

    protected function setUp()
    {
        $this->sut = new MonthToYearMonthTransformer('years', 'months');
    }
}
```
