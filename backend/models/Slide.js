module.exports = (sequelize, DataTypes) => {
  const Slide = sequelize.define('Slide', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    presentationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'presentations',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255]
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    },
    layout: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'title-content',
      validate: {
        isIn: [['title-content', 'title-only', 'content-only', 'two-column', 'full-image', 'code-focus']]
      }
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: ''
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Expected duration in seconds for this slide'
    },
    backgroundColor: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i
      }
    },
    textColor: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i
      }
    }
  }, {
    tableName: 'slides',
    indexes: [
      {
        fields: ['presentationId', 'order'],
        unique: true
      },
      {
        fields: ['presentationId']
      }
    ],
    hooks: {
      afterCreate: async (slide) => {
        // Update presentation slide count
        const presentation = await slide.getPresentation();
        if (presentation) {
          await presentation.increment('slideCount');
        }
      },
      afterDestroy: async (slide) => {
        // Update presentation slide count
        const presentation = await slide.getPresentation();
        if (presentation) {
          await presentation.decrement('slideCount');
        }
      }
    }
  });

  return Slide;
}; 