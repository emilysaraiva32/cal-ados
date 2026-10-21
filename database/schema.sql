
CREATE DATABASE IF NOT EXISTS rastreabilidade_calcados
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE rastreabilidade_calcados;

CREATE TABLE bancas (
    id_banca INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    email VARCHAR(100),
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    perfil VARCHAR(30) NOT NULL,
    id_banca INT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (id_banca) REFERENCES bancas(id_banca)
        ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE modelos_calcados (
    id_modelo INT AUTO_INCREMENT PRIMARY KEY,
    referencia VARCHAR(50) NOT NULL UNIQUE,
    descricao VARCHAR(200) NOT NULL
);

CREATE TABLE lotes (
    id_lote INT AUTO_INCREMENT PRIMARY KEY,
    numero_op VARCHAR(20) NOT NULL UNIQUE,
    codigo_identificador VARCHAR(100) NOT NULL UNIQUE,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    prazo_retorno DATETIME,
    tipo_servico VARCHAR(50) NOT NULL,
    quantidade_total INT NOT NULL,
    quantidade_aprovada INT NOT NULL DEFAULT 0,
    status_atual VARCHAR(30) NOT NULL DEFAULT 'Criado',
    id_banca INT NOT NULL,
    id_modelo INT NOT NULL,
    FOREIGN KEY (id_banca) REFERENCES bancas(id_banca),
    FOREIGN KEY (id_modelo) REFERENCES modelos_calcados(id_modelo)
);

CREATE TABLE itens_lote (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    id_lote INT NOT NULL,
    numeracao INT NOT NULL,
    quantidade_enviada INT NOT NULL,
    FOREIGN KEY (id_lote) REFERENCES lotes(id_lote)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE movimentacoes (
    id_movimentacao INT AUTO_INCREMENT PRIMARY KEY,
    id_lote INT NOT NULL,
    id_usuario INT NOT NULL,
    status_anterior VARCHAR(30),
    status_novo VARCHAR(30) NOT NULL,
    data_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    observacao TEXT,
    FOREIGN KEY (id_lote) REFERENCES lotes(id_lote),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE excecoes (
    id_excecao INT AUTO_INCREMENT PRIMARY KEY,
    id_lote INT NOT NULL,
    id_item INT NULL,
    id_usuario INT NOT NULL,
    tipo_problema VARCHAR(50) NOT NULL,
    quantidade_afetada INT NOT NULL DEFAULT 0,
    descricao TEXT NOT NULL,
    data_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_lote) REFERENCES lotes(id_lote),
    FOREIGN KEY (id_item) REFERENCES itens_lote(id_item)
        ON DELETE SET NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE evidencias (
    id_evidencia INT AUTO_INCREMENT PRIMARY KEY,
    id_lote INT NOT NULL,
    id_excecao INT NULL,
    id_usuario INT NOT NULL,
    tipo_evidencia VARCHAR(50) NOT NULL,
    caminho_arquivo VARCHAR(255) NOT NULL,
    data_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_lote) REFERENCES lotes(id_lote),
    FOREIGN KEY (id_excecao) REFERENCES excecoes(id_excecao)
        ON DELETE SET NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);
