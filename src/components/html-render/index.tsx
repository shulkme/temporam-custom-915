'use client';
import DOMPurify from 'dompurify';
import React, { forwardRef, useEffect, useState } from 'react';

interface HtmlRenderProps {
  dirtyHtml?: string;
}

const HtmlRender = forwardRef<HTMLDivElement, HtmlRenderProps>(
  ({ dirtyHtml }, ref) => {
    const [safeHtml, setSafeHtml] = useState('');

    useEffect(() => {
      // 1. 添加 Hook
      DOMPurify.addHook('afterSanitizeAttributes', function (node) {
        if (node.tagName === 'A') {
          node.setAttribute('target', '_blank');
          node.setAttribute('rel', 'noopener noreferrer');
        }
      });

      const sanitized = DOMPurify.sanitize(dirtyHtml || '', {
        ADD_ATTR: ['target', 'rel'],
      });

      // 3. 立即移除 Hook
      DOMPurify.removeHook('afterSanitizeAttributes');

      // 4. 更新 state 来触发含有安全 HTML 的重新渲染
      setSafeHtml(sanitized);
    }, [dirtyHtml]); // 每当 dirtyHtml 变化时，重新执行

    return (
      <div
        className="prose"
        ref={ref}
        dangerouslySetInnerHTML={{
          __html: safeHtml,
        }}
        style={{
          all: 'initial',
        }}
      />
    );
  },
);

HtmlRender.displayName = 'HtmlRender';

export default React.memo(HtmlRender);
