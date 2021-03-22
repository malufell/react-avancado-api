# Strapi API

API criada durante o curso de React Avançado, será o ecommerce de uma loja de jogos!

## :computer: Sobre o projeto

Back-end criado com o [Strapi](https://strapi.io/documentation/developer-docs/latest/getting-started/introduction.html): um headless CMS open-source feito 100% em JavaScript, totalmente customizável. O painel do Strapi permitirá que as pessoas não técnicas consigam inserir conteúdos diretamente no site, de uma forma simples e intuitiva :)

- A área administrativa do Strapi foi customizada para mostrar a identidade visual da loja de jogos;
- As tabelas e relacionamentos entre elas foram criadas diretamente no Strapi;
- Os dados da aplicação são populados de duas formas:
  - através de uma requisição com axios, que busca os dados da API da loja de games;
  - scrapper dos dados da página do game, com uso do JSDOM (porque essas páginas não possuem uma API, as informações são entregues já prontas para renderização no client);

![image](https://user-images.githubusercontent.com/62160705/112065770-06059c00-8b44-11eb-8819-051e994a27db.png)


> Um CMS (Content Management System - Sistema de Gerenciamento de conteúdo) é um software responsável por gerenciar o conteúdo, ou seja, permitir criação, edição e organização de um determinado conteúdo. Headless entrega somente o dado puro pela API e esse dado é tratado como quiser (posso ter um site em react, um outro sistema em vue, um app feito em react native e todos receberão a mesma informação).

## :mag_right: Requisitos

O projeto utiliza [PostgreSQL](https://www.postgresql.org/), a configuração do banco de dados está disponível em [config/database.js](config/database.js).

## :wrench: Como executar este projeto

1. Clone este repositório: `git clone https://github.com/malufell/react-avancado-api.git`
2. Acesse a pasta do projeto no seu terminal/cmd: `cd react-avancado-api`
3. Instale as dependências: `npm install`
4. Execute a aplicação em modo de desenvolvimento: `npm run develop`
5. Acesse as URLs:
   - `http://localhost:1337/admin` - Dashboard da API
   - No primeiro acesso ao `/admin` será necessário criar um usuário!
   - `http://localhost:1337/graphql` - GraphQL Playground para testar as queries
6. Popule dados na API:
   - Este projeto utiliza a rota `/games/populate` para popular os dados com origem [neste site](https://www.gog.com/games)
   - Inicialmente é necessário tornar público o acesso a essa rota: no Strapi, em "Configurações" > "Níveis e Permissões" > "Public" - é necessário flegar a rota `game:populate` e em "Upload" flegar a rota "upload" também > Salvar
   - Com o Strapi rodando (`npm run develop`), rodar o comando no console:  
    ```console
    curl -X POST http://localhost:1337/games/populate
    ```
   - Também é possível enviar parâmetros:
    ```console
    $ curl -X POST http://localhost:1337/games/populate?page=2
    $ curl -X POST http://localhost:1337/games/populate?search=simcity
    $ curl -X POST http://localhost:1337/games/populate?sort=rating&price=free
    $ curl -X POST http://localhost:1337/games/populate?availability=coming&sort=popularity
    ```

## :heart: Resultado

Exemplo de um jogo cadastrado, incluindo imagens:

![image](https://user-images.githubusercontent.com/62160705/112063269-e66c7480-8b3f-11eb-859d-604ddc133e83.png)

![image](https://user-images.githubusercontent.com/62160705/112063323-fd12cb80-8b3f-11eb-9c02-be4299c826d5.png)

