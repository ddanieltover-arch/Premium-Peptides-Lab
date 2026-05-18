'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

const SMARTSUPP_KEY =
  process.env.NEXT_PUBLIC_SMARTSUPP_KEY?.trim() ||
  '7cf570fec90232d0b0298ebc4a85dd9d7fd33fc7';

const SMARTSUPP_COLOR = '#4a9fe8';

/** Inline loader — must run before loader.js (Smartsupp install snippet). */
const SMARTSUPP_INLINE = `
var _smartsupp = _smartsupp || {};
_smartsupp.key = '${SMARTSUPP_KEY}';
_smartsupp.color = '${SMARTSUPP_COLOR}';
_smartsupp.orientation = 'left';
function _smartsuppApplyOffset() {
  var mobile = window.matchMedia('(max-width: 1023px)').matches;
  _smartsupp.offsetY = mobile ? 128 : 20;
}
_smartsuppApplyOffset();
window.addEventListener('resize', _smartsuppApplyOffset);
window.smartsupp||(function(d) {
  var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
  s=d.getElementsByTagName('script')[0];c=d.createElement('script');
  c.type='text/javascript';c.charset='utf-8';c.async=true;
  c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
})(document);
`;

export function SmartsuppChat() {
  const pathname = usePathname();
  if (!SMARTSUPP_KEY || pathname.startsWith('/admin')) return null;

  return (
    <>
      <Script id="smartsupp-live-chat" strategy="afterInteractive">
        {SMARTSUPP_INLINE}
      </Script>
      <noscript>
        Live chat powered by{' '}
        <a href="https://www.smartsupp.com" target="_blank" rel="noopener noreferrer">
          Smartsupp
        </a>
      </noscript>
    </>
  );
}
