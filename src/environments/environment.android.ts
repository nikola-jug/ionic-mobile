// bffBaseUrl  — used by the in-app WebView for API calls (profile, session/exchange, etc.).
//               10.0.2.2 is the Android emulator's alias for the host machine.
//               The cert now includes 10.0.2.2 as an IP SAN so TLS succeeds.
// bffBrowserUrl — used by Browser.open() for the OAuth2 authorization URL.
//               Must use the registered hostname so the redirect URI matches what the
//               auth server has on record. Resolved in the external browser via
//               Chromium --host-resolver-rules (→ 127.0.0.1) + adb reverse tcp:8082.
export const environment = {
  bffBaseUrl: 'https://10.0.2.2:8082',
  bffBrowserUrl: 'https://spring-boot-mobile-bff:8082',
};
