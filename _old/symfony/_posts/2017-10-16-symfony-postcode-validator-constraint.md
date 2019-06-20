---
layout: post
title: Validating Postcodes using a Symfony Constraint   
summary: Symfony constraint validator to check a UK postcode and exclude British Forces postcodes.
tags: [postcode, validation, form, regex]
featured: true
links:
    - {link: "http://www.postcodearea.co.uk/facts/formats", 
    label: "Postcodearea.co.uk: UK Postcode formats explained"}
    - {link: "https://www.regular-expressions.info/lookaround.html", 
    label: "Regular-expressions.info: Using negative lookaheads in regular expressions"}
    - {link: "http://symfony.com/doc/current/validation/custom_constraint.html", 
    label: "Symfony.com: Create a custom Validation Constraint"}
---

Note: excludes British Forces postcodes when validating the UK postcode.

#### PostcodeConstraint
Contains the message to display should the validation fail. 

```php
<?php
namespace AppBundle\Validator\Constraint;

use Symfony\Component\Validator\Constraint;

class PostcodeConstraint extends Constraint
{
    public $message = 'The value entered is not recognised as a UK postcode.';
}
```

#### PostcodeValidatorConstraint
Holds the actual validation logic and regular expression to define a 
postcode. British forces postcodes are excluded using a `negative lookahead`. 
To simplify the regex pattern we are stripping out white spaces and converting 
to uppercase before the check is made.

```php
<?php
namespace AppBundle\Validator\Constraint;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class PostcodeConstraintValidator extends ConstraintValidator
{
    /** matches UK postcodes but not british forces post codes (ie BF*) */
    const REGEX = "/^(?!BF)[A-Z]{1,2}[0-9]{1,2}[A-Z]{0,1}[0-9]{1}[A-Z]{2}$/";

    /**
     * validate the postcode entered - first trim any surrounding whitespace and
     * convert to uppercase to match the case sensitive postcode pattern
     */
    public function validate($value, Constraint $constraint)
    {
        $uppercase = trim(strtoupper(str_replace(' ', '', $value)));

        if (!preg_match(self::REGEX, $uppercase, $matches)) {
            $this->context->buildViolation($constraint->message)->addViolation();
        }
    }
}
```

#### PostcodeConstraintValidatorTest
```php
<?php
namespace AppBundle\Validator\Constraint;

use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Tests\Constraints\AbstractConstraintValidatorTest;

class PostcodeConstraintValidatorTest extends AbstractConstraintValidatorTest
{
    public function testShouldBeInstanceOfConstraintValidator()
    {
        $this->assertInstanceOf(ConstraintValidator::class, $this->validator);
    }

    /**
     * @dataProvider invalidPostCodesProvider
     */
    public function testShouldNotValidateWithInvalidPostcode($postcode)
    {
        $message = 'My message';
        $this->validator->validate($postcode, new PostcodeConstraint([
            'message' => $message
        ]));
        $this->buildViolation($message)->assertRaised();
    }

    /**
     * @dataProvider validPostCodesProvider
     */
    public function testShouldValidateWithValidPostcode($postcode)
    {
        $this->validator->validate($postcode, new PostcodeConstraint);
        $this->assertNoViolation();
    }

    public function invalidPostCodesProvider()
    {
        return [
            ['postcode' => ''],
            ['postcode' => ' '],
            ['postcode' => 12345],
            ['postcode' => '12345'],
            ['postcode' => 'BF12AY'],
        ];
    }

    public function validPostCodesProvider()
    {
        return [
            ['postcode' => 'S11AA'],
            ['postcode' => 'M601NW'],
            ['postcode' => 'CR26XH'],
            ['postcode' => 'DN551PT'],
            ['postcode' => 'W1A1HQ'],
            ['postcode' => 'EC1M1BB'],
            ['postcode' => 'le115bf'],
            ['postcode' => 'le115bf'],
            ['postcode' => '  L  E  1  1  5  B  F  '],
        ];
    }

    protected function createValidator()
    {
        return new PostcodeConstraintValidator;
    }
}
```
