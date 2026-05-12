function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set('strict-transport-security', 'max-age=31536000; includeSubDomains; preload');
  headers.set('x-content-type-options', 'nosniff');
  headers.set('referrer-policy', 'strict-origin-when-cross-origin');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

const AUTOCONFIG_XML = `<?xml version="1.0"?>
<clientConfig version="1.1">
    <emailProvider id="wearesgi.com">
        <domain>wearesgi.com</domain>
        <displayName>wearesgi.com</displayName>
        <displayShortName>wearesgi.com</displayShortName>
        <incomingServer type="imap">
            <hostname>mail.wearesgi.com</hostname>
            <port>993</port>
            <socketType>SSL</socketType>
            <authentication>password-cleartext</authentication>
            <username>%EMAILADDRESS%</username>
        </incomingServer>
        <outgoingServer type="smtp">
            <hostname>mail.wearesgi.com</hostname>
            <port>465</port>
            <socketType>SSL</socketType>
            <authentication>password-cleartext</authentication>
            <username>%EMAILADDRESS%</username>
        </outgoingServer>
    </emailProvider>
</clientConfig>
`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.protocol === 'http:') {
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }

    if (url.hostname === 'autoconfig.wearesgi.com') {
      return withSecurityHeaders(new Response(AUTOCONFIG_XML, {
        headers: {
          'content-type': 'application/xml; charset=utf-8',
          'cache-control': 'public, max-age=3600',
        },
      }));
    }

    if (url.hostname === 'mail.wearesgi.com' || url.hostname === 'ftp.wearesgi.com') {
      return withSecurityHeaders(new Response('not found', {
        status: 404,
        headers: {
          'content-type': 'text/plain; charset=utf-8',
          'cache-control': 'no-store',
        },
      }));
    }

    const response = await env.ASSETS.fetch(request);
    return withSecurityHeaders(response);
  },
};
