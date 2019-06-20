---
layout: post
title: Bulk table updates using Doctrine DBAL via a Symfony Command
summary: Updating large numbers of records using Doctrine DBAL (not advisable using Doctrine ORM for performance reasons).   
tags: [doctrine]
featured: true
links:
    - {link: "http://symfony.com/doc/3.4/doctrine/dbal.html", 
    label: "Symfony.com: How to use Doctrine DBAL"}
    - {link: "http://docs.doctrine-project.org/projects/doctrine-dbal/en/latest/reference/query-builder.html", 
    label: "Doctrine-project.org: SQL Query Builder (DBAL)"}
---

Updating large numbers of records using Doctrine ORM is not advisable for performance reasons, so we use Doctrine DBAL instead.

#### LinkProductsToModelsCommand
There are 2 ways provided to update rows in `updateProducts()`, one using Doctrine's DQL and the other using the QueryBuilder.
  
 ```php
<?php

namespace AppBundle\Command;

class LinkProductsToModelsCommand extends ContainerAwareCommand
{
    /**
     * @var EntityManager
     */
    private $entityManager;

    public function __construct(EntityManager $em)
    {
        $this->entityManager = $em;
        parent::__construct();
    }

    /**
     * {@inheritdoc}
     */
    protected function configure()
    {
        $this->setName('app:link-products-to-models');
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $firstResult = 0;
        $useDQL = false;
        
        for ($batch = 1; $batch < 1000; $batch++) {
          $productModels = $this->getModels($firstResult);
          if (empty($productModels)) {
              return;
          }
        
          $output->writeln('<info>Retrieved ' . count($productModels) . ' models in batch ' . $batch . '</info>');
        
          foreach ($productModels as $model) {
              
              if ($updateCount = $this->updateProducts($model, $useDQL)) {
                  $productUpdateCount += (int)$updateCount;
              }
              $firstResult++;
          }
          $totalModelCount += count($productModels);
        }
      
        $output->writeln(
          '<info>All done. ' . $this->productUpdateCount . ' products linked to models. Found ' .
          $this->totalProductCount . ' products relating to ' . $this->totalModelCount . ' models.</info>'
        );
    }
    
    private function getModels(int $firstResult): array
    {
        return $this->entityManager->getConnection()->createQueryBuilder()
          ->select('id', 'code', 'family_variant_id')
          ->from('pim_catalog_product_model')
          ->setFirstResult($firstResult)
          ->setMaxResults(100)
          ->execute()
          ->fetchAll(PDO::FETCH_OBJ);
    }


    private function updateProducts(ProductModel $model, bool $useDQL = false): ?int
    {
        if($useDQL) {
            $dql = 'UPDATE pim_catalog_product SET product_model_id = ? WHERE id IN (?)';
            
            return $this->entityManager->getConnection()->executeUpdate($dql,
            	[$model->id, $this->getProductIds($model)],
            	[\PDO::PARAM_INT, Connection::PARAM_INT_ARRAY]
            );
        }
        
        $builder = $this->entityManager->getConnection()->createQueryBuilder();
        return $builder->update('pim_catalog_product p')
            ->set('p.product_model_id', '?')
            ->where($builder->expr()->in('p.id', '?'))
            ->setParameter(0, $model->id, PDO::PARAM_INT)
            ->setParameter(1, $this->getProductIds($model), Connection::PARAM_INT_ARRAY)
            ->execute();
    }

    private function getProductIds(StdClass $model): array
    {
        return $this->entityManager->getConnection()->createQueryBuilder()
            ->select('id')
            ->from('pim_catalog_product')
            ->where('identifier LIKE ?')
            ->setParameter(0, trim($model->code))
            ->execute()
            ->fetchAll(PDO::FETCH_OBJ);
    }
}
```

```yaml
# app/services.yml
services:
  app.command.link_products_to_models:
    class: AppBundle\Command\LinkProductsToModelsCommand
    arguments:
      - '@entity_manager'
    tags:
        -  { name: console.command }
```