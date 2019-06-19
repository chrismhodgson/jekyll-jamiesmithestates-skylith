---
layout: post
title: Adding a User Confirmation step into a Symfony Command
summary: Symfony command requiring the user to confirm whether or not they wish to continue.
tags: [console]
featured: true
links:
    - {link: "http://symfony.com/doc/current/components/console/helpers/questionhelper.html", 
    label: "Symfony.com: Console Question Helper"}
---

Symfony command requiring the user to confirm whether or not they wish to continue. 
This is useful for running data migrations.

#### UserConfirmationCommand 
 ```php
<?php
namespace AppBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\ConfirmationQuestion;

/**
 * usage: bin/console app:user-confirmation-example 
 */
class UserConfirmationCommand extends ContainerAwareCommand
{
    /**
     * {@inheritdoc}
     */
    protected function configure()
    {
        $this
             ->setName('app:user-confirmation-example')
             ->setDescription('Command that requires a user confirmation.');
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        if (!$this->userConfirmation($input, $output)) {
            return;
        }
    }
    
    private function userConfirmation(InputInterface $input, OutputInterface $output): bool
    {
        $question = new ConfirmationQuestion(
            '<question>Are you sure you want to proceed ?</question> (y/N)', 
            false
        );
        $question->setMaxAttempts(2);
        $helper = $this->getHelper('question');

        if (!$helper->ask($input, $output, $question)) {
            $output->writeln('<info>Command halted. Nothing has been done.</info>');
            return false;
        }

        return true;
    }
}
```
