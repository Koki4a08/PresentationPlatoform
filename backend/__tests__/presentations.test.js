const request = require('supertest');
const app = require('../server');
const { sequelize, Presentation, Slide } = require('../models');

describe('Presentations API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await Presentation.destroy({ where: {} });
    await Slide.destroy({ where: {} });
  });

  describe('POST /api/presentations', () => {
    it('should create a new presentation with default slide', async () => {
      const presentationData = {
        title: 'Test Presentation',
        description: 'A test presentation',
        theme: 'default'
      };

      const response = await request(app)
        .post('/api/presentations')
        .send(presentationData)
        .expect(201);

      expect(response.body.title).toBe(presentationData.title);
      expect(response.body.slides).toHaveLength(1);
      expect(response.body.slides[0].title).toBe('Welcome');
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/api/presentations')
        .send({ description: 'Test description' })
        .expect(400);

      expect(response.body.error).toBe('Title is required');
    });
  });

  describe('GET /api/presentations', () => {
    it('should return all presentations', async () => {
      const presentation = await Presentation.create({
        title: 'Test Presentation',
        description: 'Test description'
      });

      const response = await request(app)
        .get('/api/presentations')
        .expect(200);

      expect(response.body.presentations).toHaveLength(1);
      expect(response.body.presentations[0].title).toBe('Test Presentation');
    });

    it('should support search functionality', async () => {
      await Presentation.create({ title: 'JavaScript Presentation' });
      await Presentation.create({ title: 'Python Tutorial' });

      const response = await request(app)
        .get('/api/presentations?search=JavaScript')
        .expect(200);

      expect(response.body.presentations).toHaveLength(1);
      expect(response.body.presentations[0].title).toBe('JavaScript Presentation');
    });
  });

  describe('GET /api/presentations/:id', () => {
    it('should return a specific presentation', async () => {
      const presentation = await Presentation.create({
        title: 'Test Presentation',
        description: 'Test description'
      });

      const response = await request(app)
        .get(`/api/presentations/${presentation.id}`)
        .expect(200);

      expect(response.body.title).toBe('Test Presentation');
    });

    it('should return 404 for non-existent presentation', async () => {
      const response = await request(app)
        .get('/api/presentations/999')
        .expect(404);

      expect(response.body.error).toBe('Presentation not found');
    });
  });

  describe('PUT /api/presentations/:id', () => {
    it('should update a presentation', async () => {
      const presentation = await Presentation.create({
        title: 'Original Title',
        description: 'Original description'
      });

      const updateData = {
        title: 'Updated Title',
        theme: 'dark'
      };

      const response = await request(app)
        .put(`/api/presentations/${presentation.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe('Updated Title');
      expect(response.body.theme).toBe('dark');
    });
  });

  describe('DELETE /api/presentations/:id', () => {
    it('should delete a presentation', async () => {
      const presentation = await Presentation.create({
        title: 'To Delete',
        description: 'Will be deleted'
      });

      await request(app)
        .delete(`/api/presentations/${presentation.id}`)
        .expect(200);

      const deletedPresentation = await Presentation.findByPk(presentation.id);
      expect(deletedPresentation).toBeNull();
    });
  });

  describe('POST /api/presentations/:id/duplicate', () => {
    it('should duplicate a presentation with slides', async () => {
      const presentation = await Presentation.create({
        title: 'Original Presentation',
        description: 'Original description'
      });

      await Slide.create({
        presentationId: presentation.id,
        title: 'Slide 1',
        content: '# Test Content',
        order: 0
      });

      const response = await request(app)
        .post(`/api/presentations/${presentation.id}/duplicate`)
        .expect(201);

      expect(response.body.title).toBe('Original Presentation (Copy)');
      expect(response.body.slides).toHaveLength(1);
      expect(response.body.slides[0].title).toBe('Slide 1');
    });
  });
}); 