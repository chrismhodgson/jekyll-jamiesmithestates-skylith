---
layout: post
title: Price point helper
summary: Round a price up to the next price point.
tags: [prices]
featured: true
---

#### PricePointHelper

```php
<?php
namespace AppBundle\Helper;

class PricePointHelper
{
    /**
     * Round a price up to the next price point
     * @param float|null $price
     * @return float|null
     */
    public function round(?float $price): ?float
    {
        return is_null($price) ? null : $this->getPoint($price);
    }

    /**
     * @param float $price
     * @return null|float
     */
    private function getPoint(float $price): ?float
    {
        $remainder = fmod($price, 10);
        $inverseModular = $price - $remainder;

        if (in_array($remainder, $this->getRoundingIncrements($price))) {
            return $price;
        }

        // since we are dividing by 10 we need a special rule incase it has no remainder
        if ($remainder == 0 && $price > 0 && in_array(10, $this->getRoundingIncrements($price))) {
            return $price;
        }

        $point = null;
        foreach ($this->getRoundingIncrements($price) as $increment) {
            $point = $inverseModular + $increment;
            if ($point && $price <= $point) {
                break;
            }
        }
        return $point;
    }

    /**
     * Note: Each set of increments must have number 10 in the list
     * @param float $price
     * @return array
     */
    private function getRoundingIncrements(float $price): array
    {
        if (ceil($price) <= 10) {
            return [4, 6, 8, 10];
        }
        return [2, 5, 8, 10];
    }
}
```

#### PricePointHelperTest

```php
<?php

namespace Tests\AppBundle\Helper;

use AppBundle\Helper\PricePointHelper;
use PHPUnit\Framework\TestCase;

class PricePointHelperTest extends TestCase
{
    /**
     * @dataProvider pricePointValueProvider
     */
    public function testShouldReturnCorrectPricePoint(?float $price, ?float $expected)
    {
        $this->assertSame($expected, (new PricePointHelper)->round($price));
    }

    public function pricePointValueProvider()
    {
        return [
            [null, null],
            [0, 4],
            [4, 4],
            [6, 6],
            [8, 8],
            [10, 10],
            [12, 12],
            [14, 15],
            [15, 15],
            [18, 18],
            [20, 20],
            [22, 22],
            [25, 25],
            [28, 28],
            [30, 30],
            [1, 4],
            [0.01, 4],
            [3.41, 4],
            [3.51, 4],
            [3.61, 4],
            [4.01, 6],
            [6.01, 8],
            [8.01, 10],
            [10.4, 12],
            [12.01, 15],
        ];
    }
}
```