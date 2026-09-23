import { NextRequest, NextResponse } from "next/server";

const connectSrc = [
  "https://portal.gdc.cancer.gov",
  "https://browser-intake-datadoghq.com",
  "https://api.gdc.cancer.gov",
  "https://www.google-analytics.com",
  "https://dap.digitalgov.gov",
  "https://metrics.cancer.gov",
  "https://storage.googleapis.com/idc-index-data-artifacts/",
  // Uncomment to use mock server for testing
  //"https://localhost:3100",
];

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";

  if (process.env.NODE_ENV == "development") {
    // in SJ dev environment, this would point to a local PP server instance
    const PROTEINPAINT_API =
      process.env.PROTEINPAINT_API ||
      process.env.NEXT_PUBLIC_PROTEINPAINT_API ||
      "";
    const PROTEINPAINT_HOST =
      PROTEINPAINT_API.split("://")[1]?.split("/")[0] || "";

    if (
      PROTEINPAINT_HOST &&
      !connectSrc.includes(`https://${PROTEINPAINT_HOST}`)
    )
      connectSrc.push(`https://${PROTEINPAINT_HOST}`);
  }

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    connect-src 'self' ${connectSrc.join(" ")};
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

  return response;
}

export const config = {
  matcher: [
    // Explicitly match / to fix a bug with basePath https://github.com/vercel/next.js/issues/47085
    "/",

    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
