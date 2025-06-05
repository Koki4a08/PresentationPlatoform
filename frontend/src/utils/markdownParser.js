import { fromMarkdown } from 'mdast-util-from-markdown';
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Custom component mapping for different markdown elements
const componentMap = {
  heading: ({ level, children }) => {
    const Tag = `h${level}`;
    return React.createElement(Tag, { 
      className: `heading-${level}`,
      key: Math.random()
    }, children);
  },
  
  paragraph: ({ children }) => (
    <p className="paragraph" key={Math.random()}>
      {children}
    </p>
  ),
  
  strong: ({ children }) => (
    <strong className="strong" key={Math.random()}>
      {children}
    </strong>
  ),
  
  emphasis: ({ children }) => (
    <em className="emphasis" key={Math.random()}>
      {children}
    </em>
  ),
  
  link: ({ url, children, title }) => (
    <a 
      href={url} 
      title={title} 
      className="link"
      target="_blank" 
      rel="noopener noreferrer"
      key={Math.random()}
    >
      {children}
    </a>
  ),
  
  image: ({ url, alt, title }) => (
    <img 
      src={url} 
      alt={alt} 
      title={title} 
      className="image"
      key={Math.random()}
    />
  ),
  
  code: ({ value, lang, inline }) => {
    if (inline) {
      return (
        <code className="inline-code" key={Math.random()}>
          {value}
        </code>
      );
    }
    
    return (
      <div className="code-block" key={Math.random()}>
        <SyntaxHighlighter
          language={lang || 'text'}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            borderRadius: '8px',
            fontSize: '14px'
          }}
          showLineNumbers={true}
          wrapLongLines={true}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    );
  },
  
  list: ({ ordered, children }) => {
    const Tag = ordered ? 'ol' : 'ul';
    return React.createElement(Tag, { 
      className: `list ${ordered ? 'ordered' : 'unordered'}`,
      key: Math.random()
    }, children);
  },
  
  listItem: ({ children }) => (
    <li className="list-item" key={Math.random()}>
      {children}
    </li>
  ),
  
  blockquote: ({ children }) => (
    <blockquote className="blockquote" key={Math.random()}>
      {children}
    </blockquote>
  ),
  
  table: ({ children }) => (
    <div className="table-container" key={Math.random()}>
      <table className="table">
        {children}
      </table>
    </div>
  ),
  
  tableHead: ({ children }) => (
    <thead className="table-head" key={Math.random()}>
      {children}
    </thead>
  ),
  
  tableBody: ({ children }) => (
    <tbody className="table-body" key={Math.random()}>
      {children}
    </tbody>
  ),
  
  tableRow: ({ children }) => (
    <tr className="table-row" key={Math.random()}>
      {children}
    </tr>
  ),
  
  tableCell: ({ children, align }) => (
    <td 
      className="table-cell" 
      style={{ textAlign: align }}
      key={Math.random()}
    >
      {children}
    </td>
  ),
  
  thematicBreak: () => (
    <hr className="thematic-break" key={Math.random()} />
  ),
  
  inlineCode: ({ value }) => (
    <code className="inline-code" key={Math.random()}>
      {value}
    </code>
  ),
  
  text: ({ value }) => value,
  
  break: () => <br key={Math.random()} />
};

// Transform AST node to React component
const transformNode = (node, theme = 'light') => {
  if (!node) return null;
  
  switch (node.type) {
    case 'root':
      return node.children?.map(child => transformNode(child, theme)) || [];
    
    case 'heading':
      return componentMap.heading({
        level: node.depth,
        children: node.children?.map(child => transformNode(child, theme))
      });
    
    case 'paragraph':
      return componentMap.paragraph({
        children: node.children?.map(child => transformNode(child, theme))
      });
    
    case 'strong':
      return componentMap.strong({
        children: node.children?.map(child => transformNode(child, theme))
      });
    
    case 'emphasis':
      return componentMap.emphasis({
        children: node.children?.map(child => transformNode(child, theme))
      });
    
    case 'link':
      return componentMap.link({
        url: node.url,
        title: node.title,
        children: node.children?.map(child => transformNode(child, theme))
      });
    
    case 'image':
      return componentMap.image({
        url: node.url,
        alt: node.alt,
        title: node.title
      });
    
    case 'code':
      return componentMap.code({
        value: node.value,
        lang: node.lang,
        inline: false
      });
    
    case 'inlineCode':
      return componentMap.inlineCode({
        value: node.value
      });
    
    case 'list':
      return componentMap.list({
        ordered: node.ordered,
        children: node.children?.map(child => transformNode(child, theme))
      });
    
    case 'listItem':
      return componentMap.listItem({
        children: node.children?.map(child => transformNode(child, theme))
      });
    
    case 'blockquote':
      return componentMap.blockquote({
        children: node.children?.map(child => transformNode(child, theme))
      });
    
    case 'table':
      return componentMap.table({
        children: node.children?.map(child => transformNode(child, theme))
      });
    
    case 'tableHead':
      return componentMap.tableHead({
        children: node.children?.map(child => transformNode(child, theme))
      });
    
    case 'tableBody':
      return componentMap.tableBody({
        children: node.children?.map(child => transformNode(child, theme))
      });
    
    case 'tableRow':
      return componentMap.tableRow({
        children: node.children?.map(child => transformNode(child, theme))
      });
    
    case 'tableCell':
      return componentMap.tableCell({
        align: node.align,
        children: node.children?.map(child => transformNode(child, theme))
      });
    
    case 'thematicBreak':
      return componentMap.thematicBreak();
    
    case 'text':
      return componentMap.text({
        value: node.value
      });
    
    case 'break':
      return componentMap.break();
    
    default:
      console.warn(`Unknown node type: ${node.type}`);
      return null;
  }
};

// Parse markdown to AST
export const parseMarkdownToAST = (markdown) => {
  try {
    if (!markdown || typeof markdown !== 'string') {
      return { type: 'root', children: [] };
    }
    
    return fromMarkdown(markdown);
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return { 
      type: 'root', 
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Error parsing markdown content'
            }
          ]
        }
      ]
    };
  }
};

// Render AST to React components
export const renderASTToReact = (ast, theme = 'light') => {
  try {
    if (!ast || ast.type !== 'root') {
      return null;
    }
    
    const components = transformNode(ast, theme);
    return components;
  } catch (error) {
    console.error('Error rendering AST to React:', error);
    return React.createElement('div', { className: 'error' }, 'Error rendering content');
  }
};

// Main function to parse markdown and render to React
export const parseAndRenderMarkdown = (markdown, theme = 'light') => {
  const ast = parseMarkdownToAST(markdown);
  return renderASTToReact(ast, theme);
};

// Alias for convenience (used in PresentationViewer)
export const parseMarkdown = parseAndRenderMarkdown;

// Utility function to extract slide title from markdown
export const extractSlideTitle = (markdown) => {
  if (!markdown) return 'Untitled Slide';
  
  const ast = parseMarkdownToAST(markdown);
  
  // Look for the first heading
  const findFirstHeading = (node) => {
    if (node.type === 'heading') {
      return node.children?.find(child => child.type === 'text')?.value || 'Untitled Slide';
    }
    
    if (node.children) {
      for (const child of node.children) {
        const title = findFirstHeading(child);
        if (title !== 'Untitled Slide') return title;
      }
    }
    
    return 'Untitled Slide';
  };
  
  return findFirstHeading(ast);
};

// Validate markdown syntax
export const validateMarkdown = (markdown) => {
  try {
    parseMarkdownToAST(markdown);
    return { isValid: true, errors: [] };
  } catch (error) {
    return { 
      isValid: false, 
      errors: [error.message] 
    };
  }
};

export default {
  parseMarkdownToAST,
  renderASTToReact,
  parseAndRenderMarkdown,
  extractSlideTitle,
  validateMarkdown
}; 