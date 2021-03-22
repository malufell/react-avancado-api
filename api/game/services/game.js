"use strict";

const axios = require("axios");
const slugify = require("slugify");
const qs = require("querystring");

//para o tratamento de erros desse serviço gigantesco
function Exception(e) {
    return { e, data: e.data && e.data.errors && e.data.errors };
  }

//o upload das imagens demora um pouco, por isso essa função foi criada
//função chamada no final do creategame, onde eu passo o tempo que eu quero aguardar
function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

async function getGameInfo(slug) {
  try {
      const jsdom = require("jsdom");
      const { JSDOM } = jsdom;
      const body = await axios.get(`https://www.gog.com/game/${slug}`); //chama a URL do jogo que será minerada
      const dom = new JSDOM(body.data); //montando o dom
    
      //selecionando as informações que iremos utilizar da página de jogos (description)
      const description = dom.window.document.querySelector(".description");
    
      //dados que serão retornados para o serviço populate: short_description, description (rating foi "cancelado", vai ficar padrão)
      //vai pegar somente o conteúdo de texto - em formato de string (trim), limitado a 160 caracteres (slice)
      //vai pegar o html inteiro da descrição
      return {
        rating: "FREE",
        short_description: description.textContent.trim().slice(0, 160),
        description: description.innerHTML,
      };
  } catch (e) {
    console.log("getGameInfo", Exception(e));
  }  
}

//verifica se o nome já existe, pra evitar erro na criação por causa da duplicidade
async function getByName(name, entityName) {
  const item = await strapi.services[entityName].find({ name });
  return item.length ? item[0] : null;
}

async function create(name, entityName) {
  const item = await getByName(name, entityName);

  if (!item) {
    return await strapi.services[entityName].create({
      name,
      slug: slugify(name, { lower: true }),
    });
  }
}

//upload de imagens
async function setImage({ image, game, field = "cover" }) {
    try {
        const url = `https:${image}_bg_crop_1680x655.jpg`;
        const { data } = await axios.get(url, { responseType: "arraybuffer" });
        const buffer = Buffer.from(data, "base64");
    
        const FormData = require("form-data");
        const formData = new FormData();
    
        formData.append("refId", game.id);
        formData.append("ref", "game");
        formData.append("field", field);
        formData.append("files", buffer, { filename: `${game.slug}.jpg` });
    
        console.info(`Uploading ${field} image: ${game.slug}.jpg`);
    
        await axios({
            method: "POST",
            url: `http://${strapi.config.host}:${strapi.config.port}/upload`,
            data: formData,
            headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            },
        });
    } catch (e) {
        console.log("setImage", Exception(e));
    }
}

//populando em many to many
async function createManyToManyData(products) {
  const developers = {};
  const publishers = {};
  const categories = {};
  const platforms = {};

  products.forEach((product) => {
    const { developer, publisher, genres, supportedOperatingSystems } = product;

    genres &&
      genres.forEach((item) => {
        categories[item] = true;
      });

    supportedOperatingSystems &&
      supportedOperatingSystems.forEach((item) => {
        platforms[item] = true;
      });

    developers[developer] = true;
    publishers[publisher] = true;
  });

  //pega todas as promisses e resolve, no final retorna tudo resolvido
  return Promise.all([
    ...Object.keys(developers).map((name) => create(name, "developers")),
    ...Object.keys(publishers).map((name) => create(name, "publisher")),
    ...Object.keys(categories).map((name) => create(name, "category")),
    ...Object.keys(platforms).map((name) => create(name, "platform")),
  ]);
}

async function createGames(products) {
  await Promise.all(
    products.map(async (product) => {
      const item = await getByName(product.title, "game");

      if (!item) {
        console.info(`Creating: ${product.title}...`);

        const game = await strapi.services.game.create({
          name: product.title,
          slug: product.slug.replace(/_/g, "-"),
          price: product.price.amount,
          release_date: new Date(Number(product.globalReleaseDate) * 1000).toISOString(),
          categories: await Promise.all(product.genres.map((name) => getByName(name, "category"))),
          platforms: await Promise.all(product.supportedOperatingSystems.map((name) => getByName(name, "platform"))),
          developers: [await getByName(product.developer, "developers")],
          publisher: await getByName(product.publisher, "publisher"),
          ...(await getGameInfo(product.slug)),
        });

        //depois que o jogo está criado, é feito o upload das imagens
        await setImage({ image: product.image, game }); //essas são as imagens da capa (cover)
        await Promise.all(
          product.gallery
            .slice(0, 5) //define que pegaremos no máximo 5 imagens
            .map((url) => setImage({ image: url, game, field: "gallery" })) //essas são as imagens da galeria
        );
        
        //timeout é a primeira função aqui do código
        //define a espera de 2 segundos, pois as promisses estão rodando e as imagens demoram um pouquinho
        await timeout(2000);

        return game;
      }
    })
  );
}

module.exports = {
    populate: async (params) => {
        try {
            const gogApiUrl = `https://www.gog.com/games/ajax/filtered?mediaType=game&${qs.stringify(params)}`;
            const { data: { products } } = await axios.get(gogApiUrl);
        
            await createManyToManyData(products);
            await createGames(products);

        } catch (e) {
            console.log("populate", Exception(e));
        }
    }
};
