const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database/presentations.db'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: false,
  }
});

// Import models
const Presentation = require('./Presentation')(sequelize, Sequelize.DataTypes);
const Slide = require('./Slide')(sequelize, Sequelize.DataTypes);

// Define associations
Presentation.hasMany(Slide, {
  foreignKey: 'presentationId',
  as: 'slides',
  onDelete: 'CASCADE'
});

Slide.belongsTo(Presentation, {
  foreignKey: 'presentationId',
  as: 'presentation'
});

module.exports = {
  sequelize,
  Presentation,
  Slide
}; 