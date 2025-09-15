'use client';
import { usePathname } from 'next/navigation';
import NProgress, { NProgressOptions } from 'nprogress';
import React, { useEffect } from 'react';
import './styles.css';

type PushStateInput = [
  data: never,
  unused: string,
  url?: string | URL | null | undefined,
];

interface NProgressBarProps {
  options?: Partial<NProgressOptions>;
  delay?: number;
  disableSameRoute?: boolean;
  showOnShallow?: boolean;
}

const NProgressBar: React.FC<NProgressBarProps> = React.memo(
  ({ options, showOnShallow = false }) => {
    if (options) NProgress.configure(options);

    const pathname = usePathname();

    useEffect(() => {
      NProgress.done(true);
    }, [pathname]);

    useEffect(() => {
      const startProgress = () => {
        NProgress.start();
      };

      const stopProgress = () => {
        NProgress.done(true);
      };

      const handleAnchorClick = (event: MouseEvent) => {
        const anchorElement = event.currentTarget as HTMLAnchorElement;

        // Skip anchors with target attribute but different than _self
        if (
          anchorElement.target !== '_self' &&
          anchorElement.target?.trim() !== ''
        )
          return;

        // Skip anchors with download attribute
        if (anchorElement.hasAttribute('download')) return;

        // target url without hash removed
        const targetUrl = new URL(anchorElement.href);
        const currentUrl = new URL(location.href);

        // check if search params changed
        const hasSearchParams =
          targetUrl?.searchParams?.toString() !==
          currentUrl?.searchParams?.toString();
        const paramsChanged =
          hasSearchParams && targetUrl?.search !== currentUrl?.search;
        const isSameUrl =
          targetUrl?.pathname === currentUrl?.pathname && !paramsChanged;

        // detect ctrl/cmd option/alt shift click
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
          return;

        if (showOnShallow && isSameUrl) return;
        if (isSameUrl) return;

        startProgress();
      };

      const handleMutation: MutationCallback = () => {
        const anchorElements = document.querySelectorAll('a');
        const validAnchorELes = Array.from(anchorElements).filter((anchor) => {
          if (
            anchor.href.startsWith('tel:+') ||
            anchor.href.startsWith('mailto:')
          )
            return false;
          if (anchor.target !== '_self' && anchor.target?.trim() !== '')
            return false;
          return anchor.href;
        });
        validAnchorELes.forEach((anchor) =>
          anchor.addEventListener('click', handleAnchorClick),
        );
      };

      const mutationObserver = new MutationObserver(handleMutation);
      mutationObserver.observe(document, { childList: true, subtree: true });

      const proxyStateChange = new Proxy(window.history.pushState, {
        apply: (target, thisArg, argArray: PushStateInput) => {
          stopProgress();
          return target.apply(thisArg, argArray);
        },
      });

      window.history.pushState = proxyStateChange;
      window.history.replaceState = proxyStateChange;
    }, [showOnShallow]);

    return null;
  },
  () => true,
);

NProgressBar.displayName = 'NProgressBar';

export default NProgressBar;
