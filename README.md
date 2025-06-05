# Markdown Presentation App

A modern, feature-rich presentation application that allows you to create beautiful slides using Markdown. This app combines the simplicity of Markdown with the power of a full-featured presentation tool.

## 🚀 Features

### Core Functionality
- **Markdown-based slides**: Write your content in Markdown and see it rendered beautifully
- **Navigation controls**: Move forward/backward through presentations with keyboard shortcuts
- **Real-time editing**: Edit slides with live preview
- **Multiple layouts**: Support for different slide layouts (title-content, title-only, two-column, etc.)
- **Progress tracking**: Visual progress bar showing presentation progress

### Advanced Features
- **AST-based rendering**: Parses Markdown to AST and renders directly to React components
- **Syntax highlighting**: Code snippets with syntax highlighting support
- **Multiple themes**: Dark, minimal, corporate, and creative themes
- **Hotkey support**: Keyboard shortcuts for presentation navigation and editing
- **Mobile-friendly**: Responsive design that works on all devices
- **Slide management**: Create, edit, delete, duplicate, and reorder slides

### Technical Features
- **RESTful API**: Full backend API with Express.js
- **SQLite database**: Lightweight database with Sequelize ORM
- **Component library**: Storybook integration for component development
- **Testing**: Unit and integration tests
- **Modern UI**: Clean, intuitive interface with smooth animations

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **Axios** - HTTP client
- **React Icons** - Icon library
- **React Syntax Highlighter** - Code syntax highlighting
- **Unified/Remark** - Markdown parsing and AST processing
- **React Hotkeys Hook** - Keyboard shortcut management
- **Storybook** - Component library and documentation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite** - Database
- **Sequelize** - ORM
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate limiting** - API protection

### Development & Testing
- **Jest** - Testing framework
- **React Testing Library** - React component testing
- **Supertest** - API testing
- **ESLint** - Code linting
- **Concurrently** - Run multiple npm scripts

## 📁 Project Structure

```
SendForm/
├── backend/                 # Express.js backend
│   ├── models/             # Sequelize models
│   ├── routes/             # API routes
│   ├── __tests__/          # Backend tests
│   └── database/           # SQLite database
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── services/       # API services
│   │   ├── styles/         # Global styles
│   │   └── utils/          # Utility functions
│   ├── .storybook/         # Storybook configuration
│   └── public/             # Static assets
└── package.json            # Root package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SendForm
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   # In backend directory
   cp .env.example .env
   ```

4. **Start the development servers**
   ```bash
   # From root directory - starts both backend and frontend
   npm run dev
   ```

   Or start them separately:
   ```bash
   # Terminal 1 - Backend (runs on port 5000)
   npm run server
   
   # Terminal 2 - Frontend (runs on port 3000)
   npm run client
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Storybook: http://localhost:6006 (run `npm run storybook` first)

## 🎮 Usage

### Creating a Presentation
1. Click "New Presentation" on the dashboard
2. Enter title, description, and choose a theme
3. Start editing your first slide

### Writing Slides
Use standard Markdown syntax:

```markdown
# Main Title

## Subtitle

- Bullet point 1
- Bullet point 2

### Code Example
```javascript
function hello() {
  console.log("Hello, World!");
}
\```

![Image](https://example.com/image.jpg)

> This is a blockquote
```

### Keyboard Shortcuts
- **Arrow Keys**: Navigate between slides
- **Esc**: Exit fullscreen mode
- **F**: Enter fullscreen presentation mode
- **E**: Enter edit mode
- **S**: Save slide (in edit mode)

### Available Layouts
- **Title + Content**: Standard slide with title and content
- **Title Only**: Full-screen title slide
- **Content Only**: Content without title
- **Two Column**: Side-by-side content layout
- **Code Focus**: Optimized for code display

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Backend Tests
```bash
cd backend && npm test
```

### Frontend Tests
```bash
cd frontend && npm test
```

### Test Coverage
```bash
cd frontend && npm test -- --coverage
```

## 📚 Storybook

View and develop components in isolation:

```bash
npm run storybook
```

Build static Storybook:
```bash
npm run build-storybook
```

## 🏗️ Building for Production

### Build Frontend
```bash
cd frontend && npm run build
```

### Start Production Server
```bash
npm start
```

## 🎨 Themes

### Available Themes
- **Default**: Clean, professional look
- **Dark**: Dark mode with high contrast
- **Minimal**: Simplified, typography-focused
- **Corporate**: Business-friendly styling
- **Creative**: Vibrant, modern design

### Custom Themes
Themes can be customized by modifying the theme configuration in the presentation settings.

## 📱 Mobile Support

The application is fully responsive and supports:
- Touch navigation for presentations
- Mobile-optimized editing interface
- Responsive slide layouts
- Touch-friendly controls

## 🔧 API Documentation

### Presentations
- `GET /api/presentations` - List all presentations
- `POST /api/presentations` - Create new presentation
- `GET /api/presentations/:id` - Get specific presentation
- `PUT /api/presentations/:id` - Update presentation
- `DELETE /api/presentations/:id` - Delete presentation
- `POST /api/presentations/:id/duplicate` - Duplicate presentation

### Slides
- `GET /api/slides/presentation/:id` - Get slides for presentation
- `POST /api/slides` - Create new slide
- `PUT /api/slides/:id` - Update slide
- `DELETE /api/slides/:id` - Delete slide
- `PUT /api/slides/:id/reorder` - Reorder slide

## 🔒 Security Features

- Input validation and sanitization
- Rate limiting on API endpoints
- Helmet.js security headers
- SQL injection protection via Sequelize
- XSS protection

## 🚀 Deployment

### Vercel (Recommended for Frontend)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/build`

### Heroku (For Full-Stack)
1. Create a Heroku app
2. Set environment variables
3. Deploy using Git or GitHub integration

### Environment Variables
```
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-url.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests for new functionality
5. Run tests: `npm test`
6. Commit changes: `git commit -am 'Add feature'`
7. Push to branch: `git push origin feature-name`
8. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Unified team for markdown processing tools
- All open source contributors

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](../../issues) page
2. Create a new issue with detailed description
3. Include steps to reproduce the problem

---

**Built with ❤️ using React, Node.js, and modern web technologies** 