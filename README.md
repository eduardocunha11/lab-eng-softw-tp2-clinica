# Klimed

Aplicação de uma clínica médica.

Este é o trabalho prático 2 de Laboratório de Engenharia de Software.

## Instalação

1) Instale o Node.js (versão homologada: v14.18.2) e o PostgreSQL (versão homologada: 12.2).

2) Clone este repositório com o GIT e execute os seguintes comandos dentro da pasta clonada para instalar as dependências do projeto:

```ps
cd .\back-end\
npm i
cd ..\front-end\
npm i
```

3) Acesse o arquivo `.\back-end\database\config\config.js` e configure as informações de conexão com o banco de dados de desenvolvimento na chave `development`.

4) Abra um terminal na pasta `.\back-end` do projeto e execute o seguinte comando para criar o banco de dados:

```ps
npm run db_create
```

5) Após construir o banco de dados, volte no terminal aberto na pasta `.\back-end` e inicialize o servidor da aplicação com o seguinte comando:

```ps
npm start
```

6) Por fim, abra um terminal na pasta `.\front-end` do projeto e execute o seguinte comando para iniciar a aplicação:

```ps
npm start
```

## Construindo Aplicação de Produção

1) Para gerar uma versão de distribuição para produção, abra um terminal na pasta `.\front-end` do projeto e execute o seguinte comando para enviar o front-end da aplicação para a pasta `.\back-end\public`:

```ps
npm run publish
```

2) Edite o arquivo `.\back-end\.env` alterando a variável `NODE_ENV` para o valor `production` e a variável `PORT` para a porta que deseja utilizar para o servidor web (a porta `80` é a padrão para HTTP e a `443` é a padrão para HTTPS).

3) Acesse o arquivo `.\back-end\database\config\config.js` e configure as informações de conexão com o banco de dados de produção na chave `production`.

5) Após apontar o sistema para um banco de dados de produção válido, abra um terminal na pasta `.\back-end` e inicialize a aplicação com o seguinte comando:

```ps
npm start
```

6) Em seu navegador de internet favorito, abra a página da aplicação na porta escolhida usando o IP da máquina (servidor).

## Autenticação

Após acessar o sistema com seu navegador, você pode fazer login usando as credenciais do seguinte usuário cadastrado automaticamente:

- **E-mail:** adm@gmail.com
- **Senha:** 123456
