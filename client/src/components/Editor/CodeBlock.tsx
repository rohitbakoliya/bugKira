import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism as theme } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlockComponents = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    if (inline) {
      return (
        <SyntaxHighlighter
          style={theme}
          useInlineStyles={false}
          codeTagProps={{
            style: {
              backgroundColor: '#f6f8fa',
              padding: '3px 5px',
              borderRadius: '3px',
              color: '#484e5d',
            },
          }}
          PreTag="span"
          children={String(children).replace(/\n$/, '')}
          {...props}
        />
      );
    }
    return match ? (
      <SyntaxHighlighter
        style={theme}
        language={match[1]}
        PreTag="div"
        children={String(children).replace(/\n$/, '')}
        {...props}
      />
    ) : (
      <code className={className} {...props} />
    );
  },
};

export default CodeBlockComponents;
