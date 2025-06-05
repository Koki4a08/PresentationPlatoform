module.exports = (sequelize, DataTypes) => {
  const Presentation = sequelize.define('Presentation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    theme: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'default',
      validate: {
        isIn: [['default', 'dark', 'minimal', 'corporate', 'creative']]
      }
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    slideCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    lastModified: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'presentations',
    indexes: [
      {
        fields: ['title']
      },
      {
        fields: ['lastModified']
      }
    ],
    hooks: {
      beforeUpdate: (presentation) => {
        presentation.lastModified = new Date();
      }
    }
  });

  return Presentation;
}; 