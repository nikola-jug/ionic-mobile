# ionic-mobile

Angular 21 single-page application for the mobile frontend. Despite the directory name, this project does not use the Ionic Framework or Capacitor — it is a standard Angular app that mirrors the structure of `angular-ui`. It communicates with the mobile BFF (`spring-boot-mobile-bff`, port 8082).

## Purpose

- Mobile frontend counterpart to `angular-ui`
- Targets the mobile BFF registration (`spring-boot-mobile-bff` client)
- Intended to be packaged as a native app via a deep-link-based OAuth2 redirect (`myapp://`)

## Development server

```bash
npm install
npm start   # http://localhost:4200
```

## Caveats

- **No Ionic or Capacitor** — the folder name is a placeholder; actual native mobile integration (Capacitor, deep links) has not been implemented yet.
- **Same patterns as `angular-ui`** — standalone components, signals, functional providers, strict templates, Prettier (100-char, single quotes).
- **Mobile BFF redirect URI is `myapp://`** — the post-login redirect uses a custom URI scheme rather than an HTTPS URL. This requires a native app to register the `myapp` scheme. In a browser context this redirect will not resolve.
