'use client';

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeWithHighlight = ({ children }: { children: string }) => {
    const codeBlockRegex = /```([a-z]*)\n([\s\S]*?)```/g;

    const processedContent = children
        .split(codeBlockRegex)
        .map((block, index) => {
            if (index % 3 === 2) {
                const language =
                    content.match(codeBlockRegex)[index - 1] || 'javascript';
                return (
                    <SyntaxHighlighter
                        language={language}
                        style={nightOwl}
                        key={index}
                    >
                        {block.trim()}
                    </SyntaxHighlighter>
                );
            } else {
                return <span key={index}>{block}</span>;
            }
        });

    return (
        <pre
            className='text-base text-zinc-400 font-normal whitespace-pre-wrap'
            style={{ fontFamily: 'inherit' }}
        >
            {processedContent}
        </pre>
    );
};

export default CodeWithHighlight;
