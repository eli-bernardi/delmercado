-- Database backup for db_compras
-- Created for Del Mercado System

CREATE DATABASE IF NOT EXISTS `db_compras`;
USE `db_compras`;

-- 1. Table structure for table `usuarios`
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `codUsuario` int NOT NULL AUTO_INCREMENT,
  `Nome` varchar(255) NOT NULL,
  `Sobrenome` varchar(255) NOT NULL,
  `Idade` int NOT NULL,
  `E-mail` varchar(255) NOT NULL,
  `Telefone` varchar(255) DEFAULT NULL,
  `Endereço` varchar(255) DEFAULT NULL,
  `Cidade` varchar(255) DEFAULT NULL,
  `Estado` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`codUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table structure for table `produtos`
DROP TABLE IF EXISTS `produtos`;
CREATE TABLE `produtos` (
  `codProduto` int NOT NULL AUTO_INCREMENT,
  `Nome` varchar(255) NOT NULL,
  `Descrição` text,
  `Categoria` varchar(255) DEFAULT NULL,
  `Preço` decimal(10,2) NOT NULL,
  `Percentual de desconto` decimal(5,2) DEFAULT '0.00',
  `Quantidade` int NOT NULL DEFAULT '0',
  `Marca` varchar(255) DEFAULT NULL,
  `Imagem` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`codProduto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table structure for table `compras`
DROP TABLE IF EXISTS `compras`;
CREATE TABLE `compras` (
  `idCompra` int NOT NULL AUTO_INCREMENT,
  `codUsuario` int NOT NULL,
  `codProduto` int NOT NULL,
  `tipoMovimento` enum('ENTRADA','SAIDA') NOT NULL,
  `quantidadeMovimentada` int NOT NULL,
  `precoUnitario` decimal(10,2) NOT NULL,
  `descontoAplicado` decimal(5,2) NOT NULL DEFAULT '0.00',
  `precoFinal` decimal(10,2) NOT NULL,
  `formaPagamento` enum('DEBITO','CREDITO','DINHEIRO') NOT NULL,
  `statusCompra` enum('PAGA','PENDENTE') NOT NULL,
  `dataCompra` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idCompra`),
  KEY `codUsuario` (`codUsuario`),
  KEY `codProduto` (`codProduto`),
  CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`codUsuario`) REFERENCES `usuarios` (`codUsuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `compras_ibfk_2` FOREIGN KEY (`codProduto`) REFERENCES `produtos` (`codProduto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. View structure for `vw_produtos_criticos`
DROP VIEW IF EXISTS `vw_produtos_criticos`;
CREATE OR REPLACE VIEW `vw_produtos_criticos` AS 
SELECT 
  `codProduto` AS `codigo_produto`,
  `Nome` AS `nome`,
  `Categoria` AS `categoria`,
  `Quantidade` AS `quantidade_atual` 
FROM `produtos` 
WHERE `Quantidade` < 10;

-- 5. View structure for `vw_volume_compras`
DROP VIEW IF EXISTS `vw_volume_compras`;
CREATE OR REPLACE VIEW `vw_volume_compras` AS 
SELECT 
  `p`.`Nome` AS `nome`,
  sum(`c`.`quantidadeMovimentada`) AS `quantidade_total_movimentada`,
  sum((`c`.`quantidadeMovimentada` * `c`.`precoUnitario`)) AS `valor_financeiro_movimentado` 
FROM (`compras` `c` join `produtos` `p` on((`c`.`codProduto` = `p`.`codProduto`))) 
WHERE (`c`.`tipoMovimento` = 'SAIDA') 
GROUP BY `p`.`codProduto`,`p`.`Nome`;

-- 6. Insert sample records
INSERT INTO `usuarios` (`codUsuario`, `Nome`, `Sobrenome`, `Idade`, `E-mail`, `Telefone`, `Endereço`, `Cidade`, `Estado`) VALUES 
(1, 'Carlos', 'Silva', 35, 'carlos.silva@example.com', '48991223344', 'Rua Principal, 100', 'Florianópolis', 'SC'),
(2, 'Ana', 'Souza', 28, 'ana.souza@example.com', '48998765432', 'Av Central, 500', 'São José', 'SC');

INSERT INTO `produtos` (`codProduto`, `Nome`, `Descrição`, `Categoria`, `Preço`, `Percentual de desconto`, `Quantidade`, `Marca`, `Imagem`) VALUES 
(1, 'Notebook Pro X1', 'Notebook ultra fino Intel i7 16GB RAM 512GB SSD', 'eletronicos', 4500.00, 5.00, 5, 'TechBrand', 'https://images.unsplash.com/photo-1496181130204-7552cc1524e2'),
(2, 'Mouse Gamer Wireless RGB', 'Mouse ergonômico recarregável de alta precisão', 'perifericos', 150.00, 0.00, 15, 'GameGear', 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7'),
(3, 'Monitor 27 IPS 144Hz', 'Monitor gamer bordas finas resolução Full HD', 'eletronicos', 1200.00, 10.00, 2, 'ScreenPro', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf');

INSERT INTO `compras` (`idCompra`, `codUsuario`, `codProduto`, `tipoMovimento`, `quantidadeMovimentada`, `precoUnitario`, `descontoAplicado`, `precoFinal`, `formaPagamento`, `statusCompra`, `dataCompra`) VALUES 
(1, 1, 1, 'SAIDA', 1, 4500.00, 5.00, 4275.00, 'CREDITO', 'PAGA', NOW()),
(2, 2, 2, 'SAIDA', 3, 150.00, 0.00, 450.00, 'DEBITO', 'PAGA', NOW()),
(3, 1, 3, 'ENTRADA', 10, 1200.00, 10.00, 10800.00, 'DINHEIRO', 'PAGA', NOW());
