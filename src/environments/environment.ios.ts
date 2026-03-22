// iOS Simulator shares macOS's network stack and /etc/hosts, so hostnames resolve
// to 127.0.0.1 directly — both the WKWebView and SFSafariViewController (Browser.open)
// use the same URL.
export const environment = {
  bffBaseUrl: 'https://spring-boot-mobile-bff:8082',
  bffBrowserUrl: 'https://spring-boot-mobile-bff:8082',
};
