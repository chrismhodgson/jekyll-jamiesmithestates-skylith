---
layout: post
title: Debugging slow unit tests with PHPUnit  
summary: Adding a listener to determine which unit tests run slowely.
tags: [phpunit, unit tests]
featured: true
---

#### Add to PHPUnit config

```xml
<listeners>
   <listener class="TestTimesListener" file="./TestTimesListener.php" />
</listeners>
```

#### PHPUnit Listener 
 
```php
<?php
 
class TestTimesListener implements PHPUnit_Framework_TestListener
{
    /**
     * @return int time limit in milliseconds (tests that take longer will be reported to standard out)
     */
    protected function getTimeLimit()
    {
        return 100;
    }
 
    public function startTest(PHPUnit_Framework_Test $test)
    {
    }
 
    public function endTest(PHPUnit_Framework_Test $test, $time)
    {
        /** @var PHPUnit_Framework_TestCase $test */
        $took = floor($time * 1000);
        if ($took > $this->getTimeLimit()) {
            echo "\nWarning: " . get_class($test) . '::' . $test->getName() . " took " . $took . " milliseconds\n";
        }
    }
 
    public function addError(PHPUnit_Framework_Test $test, Exception $e, $time)
    {
    }
 
    public function addRiskyTest(PHPUnit_Framework_Test $test, Exception $e, $time)
    {
    }
 
    public function addFailure(PHPUnit_Framework_Test $test, PHPUnit_Framework_AssertionFailedError $e, $time)
    {
    }
 
    public function addIncompleteTest(PHPUnit_Framework_Test $test, Exception $e, $time)
    {
    }
 
    public function addSkippedTest(PHPUnit_Framework_Test $test, Exception $e, $time)
    {
    }
 
    public function startTestSuite(PHPUnit_Framework_TestSuite $suite)
    {
    }
 
    public function endTestSuite(PHPUnit_Framework_TestSuite $suite)
    {
    }
}
```
