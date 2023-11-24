module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        firstName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        dob: {
          type: Sequelize.STRING,
          allowNull: true
        },
        password: {
          type: Sequelize.BLOB,
          allowNull: false,
        },
        salt: {
          type: Sequelize.BLOB,
          allowNull: false,
        },
        // isAdmin: {
        //   type: Sequelize.STRING,
        //   allowNull: false,
        // }
      });
      return User;
    }