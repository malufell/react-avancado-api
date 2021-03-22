"use strict";

module.exports = {
  populate: async (ctx) => {
    console.log("Starting to populate...");

    //são informações default pra quando eu não passo nada
    //se eu passar algo diferene, irá sobrescrever o que coloquei aqui, por isso tem o "...ctx.query,"
    //...ctx.query se aplica a infos novas, caso eu as passe
    const options = {
      sort: "popularity",
      page: "1",
      ...ctx.query,
    };

    await strapi.services.game.populate(options);

    ctx.send("Finished populating!");
  },
};