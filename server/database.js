'use strict';
const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  logging: false,
  storage: 'db/database.sqlite'
});

module.exports = sequelize;
module.exports.getModels = new Promise((resolve, reject) => {
  sequelize.authenticate().then(() => {
    const models = {};

    models.Tracks = sequelize.define('Track', {
      description: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.JSON
      },
      validFrom: {
        type: Sequelize.DATE
      },
      validTo: {
        type: Sequelize.DATE
      }
    }, {
      timestamps: false
    });

    // Populate the models.
    Promise.all([
      models.Tracks.sync()
    ]).then(() => {
      // Resolve with the models object.
      resolve(models);
    }).catch((err) => {
      console.error(err);
      reject(err);
    });
  });
});
