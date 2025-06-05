const express = require('express');
const { Presentation, Slide } = require('../models');
const router = express.Router();

// Get all presentations
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = search ? {
      [require('sequelize').Op.or]: [
        { title: { [require('sequelize').Op.like]: `%${search}%` } },
        { description: { [require('sequelize').Op.like]: `%${search}%` } }
      ]
    } : {};

    const presentations = await Presentation.findAndCountAll({
      where: whereClause,
      include: [{
        model: Slide,
        as: 'slides',
        attributes: ['id', 'title', 'order']
      }],
      order: [['lastModified', 'DESC'], ['slides', 'order', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      presentations: presentations.rows,
      totalCount: presentations.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(presentations.count / limit)
    });
  } catch (error) {
    console.error('Error fetching presentations:', error);
    res.status(500).json({ error: 'Failed to fetch presentations' });
  }
});

// Get presentation by ID
router.get('/:id', async (req, res) => {
  try {
    const presentation = await Presentation.findByPk(req.params.id, {
      include: [{
        model: Slide,
        as: 'slides',
        order: [['order', 'ASC']]
      }]
    });

    if (!presentation) {
      return res.status(404).json({ error: 'Presentation not found' });
    }

    res.json(presentation);
  } catch (error) {
    console.error('Error fetching presentation:', error);
    res.status(500).json({ error: 'Failed to fetch presentation' });
  }
});

// Create new presentation
router.post('/', async (req, res) => {
  try {
    const { title, description, theme = 'default', isPublic = false } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const presentation = await Presentation.create({
      title,
      description,
      theme,
      isPublic,
      slideCount: 0
    });

    // Create a default first slide
    await Slide.create({
      presentationId: presentation.id,
      title: 'Welcome',
      content: '# Welcome to Your Presentation\n\nEdit this slide to get started!',
      layout: 'title-content',
      order: 0
    });

    // Fetch the complete presentation with slides
    const completePresentation = await Presentation.findByPk(presentation.id, {
      include: [{
        model: Slide,
        as: 'slides',
        order: [['order', 'ASC']]
      }]
    });

    res.status(201).json(completePresentation);
  } catch (error) {
    console.error('Error creating presentation:', error);
    res.status(500).json({ error: 'Failed to create presentation' });
  }
});

// Update presentation
router.put('/:id', async (req, res) => {
  try {
    const { title, description, theme, isPublic } = req.body;
    
    const presentation = await Presentation.findByPk(req.params.id);
    if (!presentation) {
      return res.status(404).json({ error: 'Presentation not found' });
    }

    await presentation.update({
      title: title || presentation.title,
      description: description !== undefined ? description : presentation.description,
      theme: theme || presentation.theme,
      isPublic: isPublic !== undefined ? isPublic : presentation.isPublic
    });

    const updatedPresentation = await Presentation.findByPk(req.params.id, {
      include: [{
        model: Slide,
        as: 'slides',
        order: [['order', 'ASC']]
      }]
    });

    res.json(updatedPresentation);
  } catch (error) {
    console.error('Error updating presentation:', error);
    res.status(500).json({ error: 'Failed to update presentation' });
  }
});

// Delete presentation
router.delete('/:id', async (req, res) => {
  try {
    const presentation = await Presentation.findByPk(req.params.id);
    if (!presentation) {
      return res.status(404).json({ error: 'Presentation not found' });
    }

    await presentation.destroy();
    res.json({ message: 'Presentation deleted successfully' });
  } catch (error) {
    console.error('Error deleting presentation:', error);
    res.status(500).json({ error: 'Failed to delete presentation' });
  }
});

// Duplicate presentation
router.post('/:id/duplicate', async (req, res) => {
  try {
    const originalPresentation = await Presentation.findByPk(req.params.id, {
      include: [{
        model: Slide,
        as: 'slides',
        order: [['order', 'ASC']]
      }]
    });

    if (!originalPresentation) {
      return res.status(404).json({ error: 'Presentation not found' });
    }

    // Create new presentation
    const newPresentation = await Presentation.create({
      title: `${originalPresentation.title} (Copy)`,
      description: originalPresentation.description,
      theme: originalPresentation.theme,
      isPublic: false
    });

    // Duplicate all slides
    for (const slide of originalPresentation.slides) {
      await Slide.create({
        presentationId: newPresentation.id,
        title: slide.title,
        content: slide.content,
        layout: slide.layout,
        order: slide.order,
        notes: slide.notes,
        duration: slide.duration,
        backgroundColor: slide.backgroundColor,
        textColor: slide.textColor
      });
    }

    // Fetch the complete duplicated presentation
    const duplicatedPresentation = await Presentation.findByPk(newPresentation.id, {
      include: [{
        model: Slide,
        as: 'slides',
        order: [['order', 'ASC']]
      }]
    });

    res.status(201).json(duplicatedPresentation);
  } catch (error) {
    console.error('Error duplicating presentation:', error);
    res.status(500).json({ error: 'Failed to duplicate presentation' });
  }
});

module.exports = router; 