---
layout: post
title: Size ordering helper
summary: Order a list of sizes based on multiple rules.
tags: [sizes]
featured: true
---

#### SizeOrderHelper

```php
<?php
namespace AppBundle\Helper;

class SizeOrderHelper
{
    private const PATTERNS = [
        '^[0-9]+$' => false,
        '^[0-9\/]+$' => false,
        '^[0-9]+yrs$' => false,
        '^[0-9\-]+yrs$' => false,
        '^[XLMS]{1,3}$' => true,
        '^[XLMS]{1,3}[\/]{1}[XLMS]{1,3}$' => true,
        '^[A-Z]+$' => false,
        '^[A-Z]{1,2}[\-]{1}[A-G]{1,2}$' => false,
        '^[0-9]{2}[A-Z]{1}+$' => false
    ];

    /**
     * @param array $sizes
     * @return array
     */
    public function sort(array $sizes): array
    {
        $orderedSizes = [];
        foreach (self::PATTERNS as $pattern => $useSortFunction) {
            $matches = preg_grep('/' . $pattern . '/', $sizes);
            if ($matches) {
                $useSortFunction ? uasort($matches, [$this, 'compare']) : natsort($matches);
                $sizes = array_filter($sizes, function ($value) use ($matches) {
                    return !in_array($value, $matches);
                });
                $orderedSizes = array_merge($orderedSizes, $matches);
            }
        }
        return array_merge($orderedSizes, $sizes);
    }

    /**
     * @param string $sizeA
     * @param string $sizeB
     * @return int
     */
    private function compare(string $sizeA, string $sizeB): int
    {
        $sizeAOrder = $this->getSizeOrder($sizeA);
        $sizeBOrder = $this->getSizeOrder($sizeB);
        return $sizeAOrder > $sizeBOrder ? 1 : ($sizeAOrder < $sizeBOrder ? -1 : 0);
    }

    /**
     * @param string $value
     * @return int
     */
    private function getSizeOrder(string $value): int
    {
        $size = strpos($value, '/') ? substr($value, 0, strpos($value, '/')) : $value;
        $baseSize = substr($size, -1);
        $order = array_search($baseSize, ['S', 'M', 'L']);
        if ($baseSize == 'S') {
            $order -= strlen($size);
        }
        if ($baseSize == 'L') {
            $order += strlen($size);
        }
        return $order;
    }
}
```

#### SizeOrderHelperTest

```php
<?php
namespace Tests\AppBundle\Helper;

use AppBundle\Helper\SizeOrderHelper;
use PHPUnit\Framework\TestCase;

class SizeOrderHelperTest extends TestCase
{
    public function testShouldSortSizes()
    {
        $this->assertSame($this->getSortedSizes(), (new SizeOrderHelper)->sort($this->getUnsortedSizes()));
    }

    private function getUnsortedSizes()
    {
        return [
            "clothes_size_10" => "10",
            "clothes_size_10_12" => "10/12",
            "clothes_size_1112YRS" => "11-12yrs",
            "clothes_size_12" => "12",
            "clothes_size_12_14" => "12/14",
            "clothes_size_14" => "14",
            "clothes_size_14_16" => "14/16",
            "clothes_size_16" => "16",
            "clothes_size_16_18" => "16/18",
            "clothes_size_18" => "18",
            "clothes_size_2" => "2",
            "clothes_size_20" => "20",
            "clothes_size_20_22" => "20/22",
            "clothes_size_22" => "22",
            "clothes_size_24" => "24",
            "clothes_size_24_26" => "24/26",
            "clothes_size_26" => "26",
            "clothes_size_3_4" => "3/4",
            "clothes_size_30A" => "30A",
            "clothes_size_30B" => "30B",
            "clothes_size_30C" => "30C",
            "clothes_size_30D" => "30D",
            "clothes_size_32A" => "32A",
            "clothes_size_32B" => "32B",
            "clothes_size_32C" => "32C",
            "clothes_size_32D" => "32D",
            "clothes_size_34A" => "34A",
            "clothes_size_34B" => "34B",
            "clothes_size_34C" => "34C",
            "clothes_size_34D" => "34D",
            "clothes_size_34YRS" => "3-4yrs",
            "clothes_size_36" => "8",
            "clothes_size_36A" => "36A",
            "clothes_size_36B" => "36B",
            "clothes_size_36C" => "36C",
            "clothes_size_36D" => "36D",
            "clothes_size_38C" => "38C",
            "clothes_size_4" => "4",
            "clothes_size_41974" => "12/14",
            "clothes_size_42651" => "8/10",
            "clothes_size_5_6" => "5/6",
            "clothes_size_56YRS" => "5-6yrs",
            "clothes_size_5YRS" => "5yrs",
            "clothes_size_6" => "6",
            "clothes_size_6YRS" => "6yrs",
            "clothes_size_7_8" => "7/8",
            "clothes_size_78YRS" => "7-8yrs",
            "clothes_size_8" => "8",
            "clothes_size_8_10" => "8/10",
            "clothes_size_910YRS" => "9-10yrs",
            "clothes_size_A" => "A",
            "clothes_size_A_D" => "A-D",
            "clothes_size_AB" => "A-B",
            "clothes_size_B" => "B",
            "clothes_size_C" => "C",
            "clothes_size_CD" => "C-D",
            "clothes_size_D" => "D",
            "clothes_size_DD_" => "DD+",
            "clothes_size_DDE" => "DD-E",
            "clothes_size_FG" => "F-G",
            "clothes_size_l" => "L",
            "clothes_size_l_xl" => "L/XL",
            "clothes_size_m" => "M",
            "clothes_size_m_l" => "M/L",
            "clothes_size_n_a" => "N/A",
            "clothes_size_one_size" => "One Size",
            "clothes_size_s" => "S",
            "clothes_size_s_m" => "S/M",
            "clothes_size_xl" => "XL",
            "clothes_size_xl_xxl" => "XL/XXL",
            "clothes_size_xs" => "XS",
            "clothes_size_xs_s" => "XS/S",
            "clothes_size_xxl" => "XXL",
            "clothes_size_xxl_xxxl" => "XXL/XXXL",
            "clothes_size_xxxl" => "XXXL",
            "clothes_size_xxxxl" => "XXXXL",
            "clothing_size_xxs" => "XXS",
            "clothtes_size_10YRS" => "10yrs",
            "clothtes_size_11YRS" => "11yrs",
            "clothtes_size_12YRS" => "12yrs",
            "clothtes_size_7YRS" => "7yrs",
            "clothtes_size_8YRS" => "8yrs",
            "clothtes_size_9YRS" => "9yrs"
        ];
    }

    private function getSortedSizes()
    {
        return [
            "clothes_size_2" => "2",
            "clothes_size_4" => "4",
            "clothes_size_6" => "6",
            "clothes_size_36" => "8",
            "clothes_size_8" => "8",
            "clothes_size_10" => "10",
            "clothes_size_12" => "12",
            "clothes_size_14" => "14",
            "clothes_size_16" => "16",
            "clothes_size_18" => "18",
            "clothes_size_20" => "20",
            "clothes_size_22" => "22",
            "clothes_size_24" => "24",
            "clothes_size_26" => "26",
            "clothes_size_3_4" => "3/4",
            "clothes_size_5_6" => "5/6",
            "clothes_size_7_8" => "7/8",
            "clothes_size_42651" => "8/10",
            "clothes_size_8_10" => "8/10",
            "clothes_size_10_12" => "10/12",
            "clothes_size_12_14" => "12/14",
            "clothes_size_41974" => "12/14",
            "clothes_size_14_16" => "14/16",
            "clothes_size_16_18" => "16/18",
            "clothes_size_20_22" => "20/22",
            "clothes_size_24_26" => "24/26",
            "clothes_size_5YRS" => "5yrs",
            "clothes_size_6YRS" => "6yrs",
            "clothtes_size_7YRS" => "7yrs",
            "clothtes_size_8YRS" => "8yrs",
            "clothtes_size_9YRS" => "9yrs",
            "clothtes_size_10YRS" => "10yrs",
            "clothtes_size_11YRS" => "11yrs",
            "clothtes_size_12YRS" => "12yrs",
            "clothes_size_34YRS" => "3-4yrs",
            "clothes_size_56YRS" => "5-6yrs",
            "clothes_size_78YRS" => "7-8yrs",
            "clothes_size_910YRS" => "9-10yrs",
            "clothes_size_1112YRS" => "11-12yrs",
            "clothing_size_xxs" => "XXS",
            "clothes_size_xs" => "XS",
            "clothes_size_s" => "S",
            "clothes_size_m" => "M",
            "clothes_size_l" => "L",
            "clothes_size_xl" => "XL",
            "clothes_size_xxl" => "XXL",
            "clothes_size_xs_s" => "XS/S",
            "clothes_size_s_m" => "S/M",
            "clothes_size_m_l" => "M/L",
            "clothes_size_l_xl" => "L/XL",
            "clothes_size_xl_xxl" => "XL/XXL",
            "clothes_size_A" => "A",
            "clothes_size_B" => "B",
            "clothes_size_C" => "C",
            "clothes_size_D" => "D",
            "clothes_size_xxxl" => "XXXL",
            "clothes_size_xxxxl" => "XXXXL",
            "clothes_size_AB" => "A-B",
            "clothes_size_A_D" => "A-D",
            "clothes_size_CD" => "C-D",
            "clothes_size_DDE" => "DD-E",
            "clothes_size_FG" => "F-G",
            "clothes_size_30A" => "30A",
            "clothes_size_30B" => "30B",
            "clothes_size_30C" => "30C",
            "clothes_size_30D" => "30D",
            "clothes_size_32A" => "32A",
            "clothes_size_32B" => "32B",
            "clothes_size_32C" => "32C",
            "clothes_size_32D" => "32D",
            "clothes_size_34A" => "34A",
            "clothes_size_34B" => "34B",
            "clothes_size_34C" => "34C",
            "clothes_size_34D" => "34D",
            "clothes_size_36A" => "36A",
            "clothes_size_36B" => "36B",
            "clothes_size_36C" => "36C",
            "clothes_size_36D" => "36D",
            "clothes_size_38C" => "38C",
            "clothes_size_DD_" => "DD+",
            "clothes_size_n_a" => "N/A",
            "clothes_size_one_size" => "One Size",
            "clothes_size_xxl_xxxl" => "XXL/XXXL"
        ];
    }
}
```
