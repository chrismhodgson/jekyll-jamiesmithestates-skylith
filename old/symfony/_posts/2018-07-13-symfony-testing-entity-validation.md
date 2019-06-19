---
layout: post
title: Testing entity validation in Symfony  
summary: Unit tests for checking entity validation in Symfony.
tags: [unit tests]
featured: true
---

#### Unit Test

```php
<?php

namespace Tests\AppBundle\Entity;

use AppBundle\EntityValidationTrait;
use PHPUnit_Framework_TestCase;

class AddressValidationTest extends PHPUnit_Framework_TestCase
{
    use EntityValidationTrait;

    protected function getYamlMappingFilePath()
    {
        return __DIR__ . '/../src/AppBundle/Resources/config/validation.yml';
    }

    protected function getValidatonGroups()
    {
        return ['address'];
    }

    protected function getValidObject()
    {
        $sut = new Address;
        $sut->setProperty('Driving School');
        $sut->setHouseNumber('5');
        $sut->setStreet('The Close');
        $sut->setLocality('Thurlstone');
        $sut->setTown('Sheffield');
        $sut->setCounty('South Yorkshire');
        $sut->setPostcode('S36 4NX');

        return $sut;
    }

    protected function getValidValueSets()
    {
        return [];
    }

    protected function getInvalidValueSets()
    {
        return [
            ['houseNumber' => null],
            ['houseNumber' => ''],
            ['houseNumber' => ' '],

            ['street' => null],
            ['street' => ''],
            ['street' => ' '],

            ['town' => null],
            ['town' => ''],
            ['town' => ' '],

            ['postcode' => null],
            ['postcode' => ''],
            ['postcode' => ' '],
            ['postcode' => 'invalid postcode'],
        ];
    }
}
```

#### Entity Validation Trait 
 
```php
<?php

namespace AppBundle;

use PHPUnit_Framework_Assert;
use ReflectionProperty;
use Symfony\Bundle\FrameworkBundle\Validator\ConstraintValidatorFactory;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Validator\ValidatorBuilder;

trait EntityValidationTrait
{
    /**
     * Get a valid object from which variations will be built
     *
     * @return object
     */
    abstract protected function getValidObject();

    /**
     * Get the location of the validation yaml file(s)
     * e.g. __DIR__ . '/../Resources/config/validation.yml' or [__DIR__ . '/../Resources/config/validation.yml']
     *
     * @return object
     */
    abstract protected function getYamlMappingFilePath();

    /**
     * Get sets of values which, when applied to an otherwise valid object, will not cause a violation.
     * e.g. return ['name' => 'Richard'], ['password' => 'tibbsIsFluffy', 'confirmPassword' => 'tibbsIsFluffy'];
     *
     * @return array
     */
    abstract protected function getValidValueSets();

    /**
     * Get sets of values which, when applied to an otherwise valid object, will not cause a violation.
     * e.g. return ['name' => ''], ['password' => 'myCatIsFluffy', 'confirmPassword' => 'myCatIsFurry'];
     *
     * @return array
     */
    abstract protected function getInvalidValueSets();

    /**
     * @return array of [ConstraintValidatorClassName => $constraintValidatorInstance]
     * for use when constraints need services injecting into them
     */
    protected function getValidatonGroups()
    {
        return [];
    }

    /**
     * @return array of [validation_group,validation_group]
     * for use when entities need validation_groups
     */
    protected function getCustomConstraintValidators()
    {
        return [];
    }

    final public function provideValidDataForEntityValidationTest()
    {
        yield "Base case from getValidObject" => [[]];
        foreach ($this->getValidValueSets() as $testDescription => $valueSet) {
            yield $testDescription => [$valueSet];
        }
    }


    /**
     * @dataProvider provideValidDataForEntityValidationTest
     * @param array $validValues
     */
    final public function testValidForEntityValidationTest(array $validValues)
    {
        $object = $this->getValidObject();
        foreach ($validValues as $property => $value) {
            $this->setProperty($object, $property, $value);
        }
        $this->assertValidates($object);
    }

    final public function provideInvalidDataForEntityValidationTest()
    {
        foreach ($this->getInvalidValueSets() as $testDescription => $valueSet) {
            yield $testDescription => [$valueSet];
        }
    }

    /**
     * @dataProvider provideInvalidDataForEntityValidationTest
     * @param array $invalidValues
     */
    final public function testInvalidForEntityValidationTest(array $invalidValues)
    {
        $object = $this->getValidObject();
        foreach ($invalidValues as $property => $value) {
            $this->setProperty($object, $property, $value);
        }
        PHPUnit_Framework_Assert::assertNotEmpty(
            $this->validate($object),
            "Expected at least one constraint violation for " . var_export($object, true)
        );
    }

    private function assertValidates($object)
    {
        $violations = $this->validate($object);
        $messages = [];
        foreach ($violations as $violation) {
            $messages[] = $violation . PHP_EOL . "Invalid Value: " . var_export($violation->getInvalidValue(), true);
        }
        PHPUnit_Framework_Assert::assertEmpty($violations, implode(PHP_EOL . PHP_EOL, $messages));
    }

    private function setProperty($object, $property, $value)
    {
        $reflectionProperty = new ReflectionProperty(get_class($object), $property);
        $reflectionProperty->setAccessible(true);
        $reflectionProperty->setValue($object, $value);
    }

    /**
     * @param $object
     * @return \Symfony\Component\Validator\ConstraintViolationListInterface
     */
    protected function validate($object)
    {
        $builder = (new ValidatorBuilder())
            ->setConstraintValidatorFactory($this->createConstraintValidatorFactory());

        $paths = is_array($this->getYamlMappingFilePath()) ? $this->getYamlMappingFilePath() :
            [$this->getYamlMappingFilePath()];

        foreach ($paths as $file) {
            $builder->addYamlMapping($file);
        }

        return $builder->getValidator()->validate($object, null, $this->getValidatonGroups());
    }

    /**
     * @return ConstraintValidatorFactory
     */
    private function createConstraintValidatorFactory()
    {
        $containerBuilder = new ContainerBuilder();
        $customConstraintValidators = $this->getCustomConstraintValidators();
        foreach ($customConstraintValidators as $validatorClassName => $validator) {
            $containerBuilder->register($validatorClassName, $validatorClassName)
                ->setFactory([$this, 'createConstraintValidator'])
                ->addArgument($validator)
                ->addTag('validator.constraint_validator');
        }

        $validatorFactory = new ConstraintValidatorFactory($containerBuilder, array_combine(
            array_keys($customConstraintValidators),
            array_keys($customConstraintValidators)
        ));
        return $validatorFactory;
    }

    public function createConstraintValidator($constraintValidator)
    {
        return $constraintValidator;
    }
}
```

#### Entity

```php
<?php

namespace AppBundle\Entity;

class Address 
{
    /** @var string */
    protected $property;

    /** @var string */
    protected $houseNumber;

    /** @var string */
    protected $street;

    /** @var string */
    protected $locality;

    /** @var string */
    protected $town;

    /** @var string */
    protected $county;

    /** @var string */
    protected $postcode;

    /**
     * @return string
     */
    public function getProperty()
    {
        return $this->property;
    }

    /**
     * @param string $property
     */
    public function setProperty($property)
    {
        $this->property = $property;
    }

    /**
     * @return string
     */
    public function getHouseNumber()
    {
        return $this->houseNumber;
    }

    /**
     * @param string $houseNumber
     */
    public function setHouseNumber($houseNumber)
    {
        $this->houseNumber = $houseNumber;
    }

    /**
     * @return string
     */
    public function getStreet()
    {
        return $this->street;
    }

    /**
     * @param string $street
     */
    public function setStreet($street)
    {
        $this->street = $street;
    }

    /**
     * @return string
     */
    public function getLocality()
    {
        return $this->locality;
    }

    /**
     * @param string $locality
     */
    public function setLocality($locality)
    {
        $this->locality = $locality;
    }

    /**
     * @return string
     */
    public function getTown()
    {
        return $this->town;
    }

    /**
     * @param string $town
     */
    public function setTown($town)
    {
        $this->town = $town;
    }

    /**
     * @return string
     */
    public function getCounty()
    {
        return $this->county;
    }

    /**
     * @param string $county
     */
    public function setCounty($county)
    {
        $this->county = $county;
    }

    /**
     * @return string
     */
    public function getPostcode()
    {
        return $this->postcode;
    }

    /**
     * @param string $postcode
     */
    public function setPostcode($postcode)
    {
        $this->postcode = $postcode;
    }
}
```

#### validation.yaml

See [Validating Postcodes using a Symfony Constraint](/old/symfony/2017/10/16/symfony-postcode-validator-constraint/) for details of the PostCode Constraint

```yaml
Cdt\Services\AddressBundle\Document\Address:
  properties:
    houseNumber:
      - NotBlank: {groups: [address]}
      - Regex:    {pattern: '/[^\s]/', groups: [address]}
    street:
      - NotBlank: {groups: [address]}
      - Regex:    {pattern: '/[^\s]/', groups: [address]}
    town:
      - NotBlank: {groups: [address]}
      - Regex:    {pattern: '/[^\s]/', groups: [address]}
    postcode:
      - AppBundle\Validator\Constraint\PostcodeConstraint: {groups: [address]}
```