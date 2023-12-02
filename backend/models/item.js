module.exports = (sequelize, Sequelize) => {
  const Item = sequelize.define(
    "items",
    {
      title: {
        type: Sequelize.STRING,
      },
      budget: {
        type: Sequelize.FLOAT,
      },
      spend: {
        type: Sequelize.FLOAT,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      timestamps: false,
    }
  );

  return Item;
};
