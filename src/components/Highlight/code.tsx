'use client';

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeWithHighlight = ({ children }: { children: string }) => {
    const codeBlockRegex = /```([a-z]*)\n([\s\S]*?)```/g;
    const boldTextRegex = /\*\*(.*?)\*\*/g;
    const monospaceTextRegex = /`(.*?)`/g;

    const formatText = (text: string) => {
        const boldFormatted = text.split(boldTextRegex).map((part, i) =>
            i % 2 === 1 ? (
                <span
                    className='text-lg font-bold'
                    key={i}
                >
                    {part}
                </span>
            ) : (
                part
            )
        );

        return boldFormatted.map((item: any, i: number) =>
            typeof item === 'string'
                ? item.split(monospaceTextRegex).map((subPart, j) =>
                      j % 2 === 1 ? (
                          <span
                              className='font-medium'
                              key={j}
                              style={{ fontFamily: 'monospace' }}
                          >
                              {subPart}
                          </span>
                      ) : (
                          subPart
                      )
                  )
                : item
        );
    };

    const processedContent = children
        .split(codeBlockRegex)
        .map((block, index) => {
            if (index % 3 === 2) {
                const matches = children.match(codeBlockRegex);
                const language =
                    matches && matches[index - 1]
                        ? matches[index - 1]
                        : 'javascript';
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
                return <span key={index}>{formatText(block)}</span>;
            }
        });

    return (
        <div>
            <pre
                className='text-sm text-zinc-400 font-normal whitespace-pre-wrap h-full'
                style={{ fontFamily: 'inherit' }}
            >
                {processedContent}
            </pre>
        </div>
    );
};

export default CodeWithHighlight;
