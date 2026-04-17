'use client';

import { useLayoutEffect, useRef } from 'react';

interface OpenAPIDefaultOpenResponseProps {
  statusCode?: string;
}

export function OpenAPIDefaultOpenResponse({
  statusCode = '200'
}: OpenAPIDefaultOpenResponseProps) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const scope = scopeRef.current?.parentElement;
    if (!scope) return;

    const openResponse = () => {
      const responseHeading = scope.querySelector<HTMLElement>('#response-body');
      const responsesRoot = responseHeading?.nextElementSibling;
      if (!responsesRoot) return false;

      const triggers = Array.from(
        responsesRoot.querySelectorAll<HTMLButtonElement>('button')
      );

      const targetTrigger =
        triggers.find(trigger =>
          trigger.textContent?.trim().startsWith(statusCode)
        ) ?? triggers[0];

      if (!targetTrigger) return false;
      if (targetTrigger.getAttribute('data-state') === 'open') return true;

      targetTrigger.click();
      return true;
    };

    if (openResponse()) return;

    const observer = new MutationObserver(() => {
      if (openResponse()) {
        observer.disconnect();
      }
    });

    observer.observe(scope, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-state']
    });

    return () => observer.disconnect();
  }, [statusCode]);

  return <div ref={scopeRef} className='hidden' aria-hidden='true' />;
}
