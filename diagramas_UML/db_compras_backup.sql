-- Backup Físico do Banco de Dados - Del Mercado
-- Gerado para fins de homologação de especificação técnica pelo P.O.
CREATE DATABASE IF NOT EXISTS `db_compras`;
USE `db_compras`;
--
-- Estrutura da tabela `usuarios`
--
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `codUsuario` int NOT NULL AUTO_INCREMENT,
  `Nome` varchar(255) NOT NULL,
  `Sobrenome` varchar(255) NOT NULL,
  `Idade` int NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Telefone` varchar(255) NOT NULL,
  `Endereco` varchar(255) NOT NULL,
  `Cidade` varchar(255) NOT NULL,
  `Estado` varchar(255) NOT NULL,
  PRIMARY KEY (`codUsuario`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
--
-- Estrutura da tabela `produtos`
--
DROP TABLE IF EXISTS `produtos`;
CREATE TABLE `produtos` (
  `codProduto` int NOT NULL AUTO_INCREMENT,
  `Nome` varchar(255) NOT NULL,
  `Descricao` text NOT NULL,
  `Categoria` varchar(255) NOT NULL,
  `Preco` decimal(10, 2) NOT NULL,
  `PercentualDesconto` decimal(5, 2) NOT NULL,
  `Quantidade` int NOT NULL,
  `Marca` varchar(255) NOT NULL,
  `Imagem` varchar(255) NOT NULL,
  PRIMARY KEY (`codProduto`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
--
-- Estrutura da tabela `compras`
--
DROP TABLE IF EXISTS `compras`;
CREATE TABLE `compras` (
  `idCompra` int NOT NULL AUTO_INCREMENT,
  `codUsuario` int NOT NULL,
  `codProduto` int NOT NULL,
  `tipoMovimento` enum('ENTRADA', 'SAIDA') NOT NULL,
  `quantidadeMovimentada` int NOT NULL,
  `precoUnitario` decimal(10, 2) NOT NULL,
  `descontoAplicado` decimal(5, 2) NOT NULL,
  `precoFinal` decimal(10, 2) NOT NULL,
  `formaPagamento` enum('DINHEIRO', 'DEBITO', 'CREDITO') NOT NULL,
  `statusCompra` enum('PAGA', 'PENDENTE') NOT NULL,
  `dataCompra` datetime NOT NULL,
  PRIMARY KEY (`idCompra`),
  KEY `codUsuario` (`codUsuario`),
  KEY `codProduto` (`codProduto`),
  CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`codUsuario`) REFERENCES `usuarios` (`codUsuario`) ON DELETE CASCADE,
  CONSTRAINT `compras_ibfk_2` FOREIGN KEY (`codProduto`) REFERENCES `produtos` (`codProduto`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
--
-- Estrutura da View `vw_produtos_criticos`
--
CREATE OR REPLACE VIEW `vw_produtos_criticos` AS
SELECT `codProduto` AS `codigo_produto`,
  `Nome` AS `nome`,
  `Categoria` AS `categoria`,
  `Quantidade` AS `quantidade_atual`
FROM `produtos`
WHERE `Quantidade` < 10;
--
-- Estrutura da View `vw_volume_compras`
--
CREATE OR REPLACE VIEW `vw_volume_compras` AS
SELECT `p`.`Nome` AS `nome`,
  SUM(`c`.`quantidadeMovimentada`) AS `quantidade_total_movimentada`,
  SUM(
    `c`.`quantidadeMovimentada` * `c`.`precoUnitario`
  ) AS `valor_financeiro_movimentado`
FROM `compras` `c`
  INNER JOIN `produtos` `p` ON `c`.`codProduto` = `p`.`codProduto`
WHERE `c`.`tipoMovimento` = 'SAIDA'
GROUP BY `p`.`codProduto`,
  `p`.`Nome`;
--
-- Inserção de dados de teste iniciais (demonstrativos)
--
INSERT INTO `usuarios` (`codUsuario`, `Nome`, `Sobrenome`, `Idade`, `Email`, `Telefone`, `Endereco`, `Cidade`, `Estado`) VALUES
(
  1,
  'Maria',
  'Silva',
  28,
  'maria.silva@exemplo.com',
  '(48) 99999-1111',
  'Rua Central, 100',
  'Florianópolis',
  'SC'
);
INSERT INTO `produtos` (
    `codProduto`,
    `Nome`,
    `Descricao`,
    `Categoria`,
    `Preco`,
    `PercentualDesconto`,
    `Quantidade`,
    `Marca`,
    `Imagem`
  )
VALUES (
    1,
    'Tênis Running Premium Pro',
    'Versão profissional do tênis de corrida esportivo confortável.',
    'Calçados',
    649.90,
    15.00,
    20,
    'SportMax',
    'https://dummyjson.com/product-assets/shoes/1.jpg'
  ),
  (
    2,
    'Teclado Mecânico Glow',
    'Teclado RGB switch blue.',
    'Eletrônicos',
    199.90,
    0.00,
    5,
    'GlowTech',
    'https://dummyjson.com/product-assets/keyboard.jpg'
  );
INSERT INTO `compras` (
    `idCompra`,
    `codUsuario`,
    `codProduto`,
    `tipoMovimento`,
    `quantidadeMovimentada`,
    `precoUnitario`,
    `descontoAplicado`,
    `precoFinal`,
    `formaPagamento`,
    `statusCompra`,
    `dataCompra`
  )
VALUES (
    1,
    1,
    1,
    'SAIDA',
    5,
    649.90,
    15.00,
    2762.08,
    'DEBITO',
    'PAGA',
    NOW()
  );