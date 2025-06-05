import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    width: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f8f9fa;
    color: #212529;
  }

  #root {
    height: 100%;
    width: 100%;
  }

  .app {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  /* Typography */
  .heading-1 {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1.2;
    margin: 0 0 1rem 0;
    color: #1a1a1a;
  }

  .heading-2 {
    font-size: 2rem;
    font-weight: 600;
    line-height: 1.3;
    margin: 0 0 0.8rem 0;
    color: #2a2a2a;
  }

  .heading-3 {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.4;
    margin: 0 0 0.6rem 0;
    color: #3a3a3a;
  }

  .heading-4 {
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.4;
    margin: 0 0 0.5rem 0;
    color: #4a4a4a;
  }

  .heading-5 {
    font-size: 1.1rem;
    font-weight: 500;
    line-height: 1.4;
    margin: 0 0 0.4rem 0;
    color: #5a5a5a;
  }

  .heading-6 {
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.4;
    margin: 0 0 0.3rem 0;
    color: #6a6a6a;
  }

  .paragraph {
    font-size: 1rem;
    line-height: 1.6;
    margin: 0 0 1rem 0;
    color: #4a4a4a;
  }

  .strong {
    font-weight: 600;
  }

  .emphasis {
    font-style: italic;
  }

  .link {
    color: #007bff;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: all 0.2s ease;

    &:hover {
      color: #0056b3;
      border-bottom-color: #0056b3;
    }
  }

  .image {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1rem 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .inline-code {
    background-color: #f1f3f4;
    color: #c7254e;
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
    font-size: 0.9em;
  }

  .code-block {
    margin: 1rem 0;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .list {
    margin: 0 0 1rem 0;
    padding-left: 1.5rem;

    &.ordered {
      list-style-type: decimal;
    }

    &.unordered {
      list-style-type: disc;
    }
  }

  .list-item {
    margin: 0.3rem 0;
    line-height: 1.5;
  }

  .blockquote {
    margin: 1rem 0;
    padding: 1rem 1.5rem;
    border-left: 4px solid #007bff;
    background-color: #f8f9fa;
    border-radius: 0 8px 8px 0;
    font-style: italic;
    color: #5a5a5a;
  }

  .table-container {
    margin: 1rem 0;
    overflow-x: auto;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
  }

  .table-head {
    background-color: #f8f9fa;
  }

  .table-cell {
    padding: 0.75rem;
    border-bottom: 1px solid #dee2e6;
    text-align: left;
  }

  .table-head .table-cell {
    font-weight: 600;
    color: #495057;
    border-bottom: 2px solid #dee2e6;
  }

  .thematic-break {
    margin: 2rem 0;
    border: none;
    height: 1px;
    background-color: #dee2e6;
  }

  /* Theme variations */
  .theme-dark {
    background-color: #1a1a1a;
    color: #e9ecef;

    .heading-1, .heading-2, .heading-3, .heading-4, .heading-5, .heading-6 {
      color: #f8f9fa;
    }

    .paragraph {
      color: #ced4da;
    }

    .link {
      color: #66b3ff;

      &:hover {
        color: #4da6ff;
      }
    }

    .inline-code {
      background-color: #2d3748;
      color: #f687b3;
    }

    .blockquote {
      background-color: #2d3748;
      border-left-color: #66b3ff;
      color: #a0aec0;
    }

    .table {
      background-color: #2d3748;
      color: #e9ecef;
    }

    .table-head {
      background-color: #1a202c;
    }

    .table-cell {
      border-bottom-color: #4a5568;
    }

    .thematic-break {
      background-color: #4a5568;
    }
  }

  .theme-minimal {
    font-family: 'Georgia', 'Times New Roman', serif;

    .heading-1, .heading-2, .heading-3, .heading-4, .heading-5, .heading-6 {
      font-family: 'Helvetica Neue', 'Arial', sans-serif;
      font-weight: 300;
    }

    .paragraph {
      font-size: 1.1rem;
      line-height: 1.8;
    }
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .heading-1 {
      font-size: 2rem;
    }

    .heading-2 {
      font-size: 1.75rem;
    }

    .heading-3 {
      font-size: 1.5rem;
    }

    .paragraph {
      font-size: 0.95rem;
    }

    .list {
      padding-left: 1rem;
    }

    .table-container {
      font-size: 0.9rem;
    }

    .table-cell {
      padding: 0.5rem;
    }
  }

  @media (max-width: 480px) {
    .heading-1 {
      font-size: 1.75rem;
    }

    .heading-2 {
      font-size: 1.5rem;
    }

    .heading-3 {
      font-size: 1.25rem;
    }

    .paragraph {
      font-size: 0.9rem;
    }
  }

  /* Accessibility */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Focus styles */
  button:focus,
  input:focus,
  textarea:focus,
  select:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }

  /* Scroll styles */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  /* Loading animation */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .loading-spinner {
    animation: spin 1s linear infinite;
  }

  /* Fade animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes slideInUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }

  .slide-in-up {
    animation: slideInUp 0.3s ease-out;
  }

  /* Utility classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .text-center {
    text-align: center;
  }

  .text-left {
    text-align: left;
  }

  .text-right {
    text-align: right;
  }

  .mt-1 { margin-top: 0.25rem; }
  .mt-2 { margin-top: 0.5rem; }
  .mt-3 { margin-top: 1rem; }
  .mt-4 { margin-top: 1.5rem; }
  .mb-1 { margin-bottom: 0.25rem; }
  .mb-2 { margin-bottom: 0.5rem; }
  .mb-3 { margin-bottom: 1rem; }
  .mb-4 { margin-bottom: 1.5rem; }
`; 