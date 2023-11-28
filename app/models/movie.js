module.exports = (sequelize, Sequelize) => {
  const Movie = sequelize.define("Movie", {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    releaseDate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    duration: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    imageUrl: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    cost: {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 100.9
    }
  });
  return Movie;
};
