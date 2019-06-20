---
layout: post
title: Accepting Arguments in Symfony Commands 
summary: Passing optional and required arguments to a symfony command.
tags: [console]
featured: true
links:
    - {link: "https://symfony.com/doc/current/console/input.html", 
    label: "Symfony.com: Console Input (Arguments & Options)"}
---

#### ArgumentExampleCommand 
Command that requires an argument to be passed.  

```php
<?php
namespace AppBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * usage: bin/console app:argument-example ID
 */
class ArgumentExampleCommand extends ContainerAwareCommand
{
    /**
     * {@inheritdoc}
     */
    protected function configure()
    {
        $this
             ->setName('app:argument-example')
             ->setDescription('Example command requiring an argument to be passed')
             ->addArgument('id', InputArgument::REQUIRED, 'Id of something');
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln('<info>id is ' . $input->getArgument('id') . '</info>');
    }
}
```

#### OptionExampleCommand 
Command allowing an optional argument to be passed.   

```php
<?php
namespace AppBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * usage: bin/console app:option-example --id=ID
 */
class OptionExampleCommand extends ContainerAwareCommand
{
    /**
     * {@inheritdoc}
     */
    protected function configure()
    {
        $this
            ->setName('app:option-example')
            ->setDescription('Example command allowing an optional argument to be passed')
            ->addOption('id', null, InputOption::VALUE_REQUIRED, 'the id of something');
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $id = $input->hasOption('id') ? $input->getOption('id') : '';
        $output->writeln('<info>id is ' . $id . '</info>');
    }
}
```