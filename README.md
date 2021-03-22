# Strapi API

API criada durante o curso de React Avançado!

## Sobre o projeto

Back-end criado com o [Strapi](https://strapi.io/documentation/developer-docs/latest/getting-started/introduction.html): um headless CMS open-source feito 100% em JavaScript, totalmente customizável.

O painel do Strapi permitirá que as pessoas não tecnicas consigam inserir conteúdos diretamente no site, de uma forma simples e intuitiva :)

## Requisitos

O projeto utiliza [PostgreSQL](https://www.postgresql.org/), a configuração do banco de dados está disponível em [config/database.js](config/database.js).

## Como executar este projeto

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
   - Com o Strapi rodando (`npm run develop`), rodar o comando no console:  `curl -X POST http://localhost:1337/games/populate`
   - Também é possível enviar parâmetros:
    ```console
    $ curl -X POST http://localhost:1337/games/populate?page=2
    $ curl -X POST http://localhost:1337/games/populate?search=simcity
    $ curl -X POST http://localhost:1337/games/populate?sort=rating&price=free
    $ curl -X POST http://localhost:1337/games/populate?availability=coming&sort=popularity
    ```

Resultado - exemplo de um jogo cadastrado, incluindo imagens:

![image](https://user-images.githubusercontent.com/62160705/112063269-e66c7480-8b3f-11eb-859d-604ddc133e83.png)

![image](https://user-images.githubusercontent.com/62160705/112063323-fd12cb80-8b3f-11eb-9c02-be4299c826d5.png)

