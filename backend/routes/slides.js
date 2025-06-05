const express = require('express');
const { Slide, Presentation } = require('../models');
const router = express.Router();

// Get slides by presentation ID
router.get('/presentation/:presentationId', async (req, res) => {
  try {
    const slides = await Slide.findAll({
      where: { presentationId: req.params.presentationId },
      order: [['order', 'ASC']]
    });

    res.json(slides);
  } catch (error) {
    console.error('Error fetching slides:', error);
    res.status(500).json({ error: 'Failed to fetch slides' });
  }
});

// Get single slide
router.get('/:id', async (req, res) => {
  try {
    const slide = await Slide.findByPk(req.params.id, {
      include: [{
        model: Presentation,
        as: 'presentation',
        attributes: ['id', 'title', 'theme']
      }]
    });

    if (!slide) {
      return res.status(404).json({ error: 'Slide not found' });
    }

    res.json(slide);
  } catch (error) {
    console.error('Error fetching slide:', error);
    res.status(500).json({ error: 'Failed to fetch slide' });
  }
});

// Create new slide
router.post('/', async (req, res) => {
  try {
    const { 
      presentationId, 
      title, 
      content = '', 
      layout = 'title-content',
      order,
      notes = '',
      duration,
      backgroundColor,
      textColor
    } = req.body;

    if (!presentationId || !title) {
      return res.status(400).json({ error: 'Presentation ID and title are required' });
    }

    // Check if presentation exists
    const presentation = await Presentation.findByPk(presentationId);
    if (!presentation) {
      return res.status(404).json({ error: 'Presentation not found' });
    }

    // If no order specified, add to the end
    let slideOrder = order;
    if (slideOrder === undefined) {
      const lastSlide = await Slide.findOne({
        where: { presentationId },
        order: [['order', 'DESC']]
      });
      slideOrder = lastSlide ? lastSlide.order + 1 : 0;
    }

    // If inserting in the middle, shift other slides
    if (order !== undefined) {
      await Slide.increment('order', {
        where: {
          presentationId,
          order: { [require('sequelize').Op.gte]: order }
        }
      });
    }

    const slide = await Slide.create({
      presentationId,
      title,
      content,
      layout,
      order: slideOrder,
      notes,
      duration,
      backgroundColor,
      textColor
    });

    res.status(201).json(slide);
  } catch (error) {
    console.error('Error creating slide:', error);
    res.status(500).json({ error: 'Failed to create slide' });
  }
});

// Update slide
router.put('/:id', async (req, res) => {
  try {
    const slide = await Slide.findByPk(req.params.id);
    if (!slide) {
      return res.status(404).json({ error: 'Slide not found' });
    }

    const {
      title,
      content,
      layout,
      notes,
      duration,
      backgroundColor,
      textColor
    } = req.body;

    await slide.update({
      title: title !== undefined ? title : slide.title,
      content: content !== undefined ? content : slide.content,
      layout: layout || slide.layout,
      notes: notes !== undefined ? notes : slide.notes,
      duration: duration !== undefined ? duration : slide.duration,
      backgroundColor: backgroundColor !== undefined ? backgroundColor : slide.backgroundColor,
      textColor: textColor !== undefined ? textColor : slide.textColor
    });

    res.json(slide);
  } catch (error) {
    console.error('Error updating slide:', error);
    res.status(500).json({ error: 'Failed to update slide' });
  }
});

// Delete slide
router.delete('/:id', async (req, res) => {
  try {
    const slide = await Slide.findByPk(req.params.id);
    if (!slide) {
      return res.status(404).json({ error: 'Slide not found' });
    }

    const { presentationId, order } = slide;

    await slide.destroy();

    // Shift remaining slides down
    await Slide.decrement('order', {
      where: {
        presentationId,
        order: { [require('sequelize').Op.gt]: order }
      }
    });

    res.json({ message: 'Slide deleted successfully' });
  } catch (error) {
    console.error('Error deleting slide:', error);
    res.status(500).json({ error: 'Failed to delete slide' });
  }
});

// Reorder slides
router.put('/:id/reorder', async (req, res) => {
  try {
    const { newOrder } = req.body;
    
    if (newOrder === undefined || newOrder < 0) {
      return res.status(400).json({ error: 'Valid new order is required' });
    }

    const slide = await Slide.findByPk(req.params.id);
    if (!slide) {
      return res.status(404).json({ error: 'Slide not found' });
    }

    const oldOrder = slide.order;
    const { presentationId } = slide;

    if (oldOrder === newOrder) {
      return res.json(slide);
    }

    // Update orders for affected slides
    if (newOrder > oldOrder) {
      // Moving down: decrease order for slides between old and new position
      await Slide.decrement('order', {
        where: {
          presentationId,
          order: {
            [require('sequelize').Op.gt]: oldOrder,
            [require('sequelize').Op.lte]: newOrder
          }
        }
      });
    } else {
      // Moving up: increase order for slides between new and old position
      await Slide.increment('order', {
        where: {
          presentationId,
          order: {
            [require('sequelize').Op.gte]: newOrder,
            [require('sequelize').Op.lt]: oldOrder
          }
        }
      });
    }

    // Update the slide's order
    await slide.update({ order: newOrder });

    // Return all slides in new order
    const slides = await Slide.findAll({
      where: { presentationId },
      order: [['order', 'ASC']]
    });

    res.json(slides);
  } catch (error) {
    console.error('Error reordering slide:', error);
    res.status(500).json({ error: 'Failed to reorder slide' });
  }
});

// Duplicate slide
router.post('/:id/duplicate', async (req, res) => {
  try {
    const originalSlide = await Slide.findByPk(req.params.id);
    if (!originalSlide) {
      return res.status(404).json({ error: 'Slide not found' });
    }

    // Find the order for the new slide (right after the original)
    const newOrder = originalSlide.order + 1;

    // Shift slides after the original slide
    await Slide.increment('order', {
      where: {
        presentationId: originalSlide.presentationId,
        order: { [require('sequelize').Op.gte]: newOrder }
      }
    });

    // Create the duplicate
    const duplicatedSlide = await Slide.create({
      presentationId: originalSlide.presentationId,
      title: `${originalSlide.title} (Copy)`,
      content: originalSlide.content,
      layout: originalSlide.layout,
      order: newOrder,
      notes: originalSlide.notes,
      duration: originalSlide.duration,
      backgroundColor: originalSlide.backgroundColor,
      textColor: originalSlide.textColor
    });

    res.status(201).json(duplicatedSlide);
  } catch (error) {
    console.error('Error duplicating slide:', error);
    res.status(500).json({ error: 'Failed to duplicate slide' });
  }
});

module.exports = router; 