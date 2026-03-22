# ionic-mobile

Angular 21 + Ionic 8 + Capacitor 7 mobile application. Communicates with the mobile BFF (`spring-boot-mobile-bff`, port 8082) via a session cookie — it never holds or sees OAuth2 tokens.

## Purpose

- Mobile frontend counterpart to `angular-ui`
- Targets the mobile BFF (`spring-boot-mobile-bff` client)
- Packaged as a native app via Capacitor; OAuth2 redirect uses the `myapp://` custom URI scheme

## Auth flow

1. Login button calls `Browser.open()` to open the BFF's `/oauth2/authorization/{provider}` URL in the system browser (Chrome Custom Tab on Android, SFSafariViewController on iOS)
2. The BFF performs the full OAuth2/PKCE dance with the chosen identity provider
3. On success, `MobileAuthenticationSuccessHandler` generates a short-lived (30 s) one-time code and redirects to `myapp://callback?code=<uuid>`
4. The OS intercepts `myapp://` and fires the `appUrlOpen` event in the app
5. `app.ts` extracts the code and calls `authService.exchangeSession(code)`
6. `POST /session/exchange` atomically validates and deletes the code, sets `Set-Cookie: SESSION=...`, and returns the user's profile data in the response body
7. The app stores the profile and navigates to `/profile`

Logout opens the BFF's `/logout` URL in `Browser.open()`. The system browser carries the session cookie, allowing the BFF to complete the OIDC end-session flow.

## Known limitation — iOS 17+

On iOS 17+, SFSafariViewController silently closes when it encounters a `myapp://` redirect without firing `appUrlOpen`. This breaks the login callback. iOS login is currently unsupported; Android is fully functional.

## Routes

| Route | Guard | Description |
|---|---|---|
| `/` | None | Home — redirects to `/profile` if already authenticated |
| `/profile` | `authGuard` | Displays profile data |
| `/payments` | `authGuard` | Payments (Keycloak login required) |

## Development server

```bash
npm install
npm start   # http://localhost:4200
```

## Android

### One-time emulator setup

Requires an AOSP emulator (no Google Play Store) started with `-writable-system`. Run once per new emulator:

```bash
./setup-android.sh   # from project root
```

This installs the mkcert root CA as a system certificate, adds container hostnames to `/etc/hosts`, and configures Chrome to ignore certificate errors.

> **Note:** `/etc/hosts` changes do not survive a reboot on API 36. `run-android.sh` re-establishes hostname resolution via `--host-resolver-rules` and `adb reverse` on every run, so a manual re-run of `setup-android.sh` is only needed after a full emulator wipe.

### Running on Android

```bash
./run-android.sh   # from project root
```

This builds the Angular app with the `android` configuration, syncs Capacitor, deploys to the connected emulator, and sets up `adb reverse` tunnels and hostname resolution.

### Environment (Android)

`environment.android.ts` uses two separate URLs:

| Variable | Value | Reason |
|---|---|---|
| `bffBaseUrl` | `https://10.0.2.2:8082` | In-app WebView API calls — `10.0.2.2` is the emulator's alias for the host machine; the cert includes this IP as a SAN |
| `bffBrowserUrl` | `https://spring-boot-mobile-bff:8082` | `Browser.open()` OAuth2 URL — must use the registered hostname; resolved in the external browser via `--host-resolver-rules` + `adb reverse` |

## iOS

iOS uses the standard Capacitor Xcode workflow. From the project root, sync web assets:

```bash
cd ionic-mobile && npm run cap:ios   # builds Angular, syncs Capacitor, opens Xcode
```

Then build and run from Xcode targeting the simulator or a device.

> **Note:** Login is broken on iOS 17+ (see Known limitation above). The simulator can be used for UI and navigation testing but the OAuth2 flow will not complete.

### Environment (iOS)

`environment.ios.ts` uses `https://spring-boot-mobile-bff:8082` for both `bffBaseUrl` and `bffBrowserUrl`. The iOS Simulator shares macOS's network stack and `/etc/hosts`, so the BFF hostname resolves directly.

Add the mkcert root CA to the simulator's keychain for TLS trust:

```bash
xcrun simctl keychain booted add-root-cert certs/rootCA.pem
```

## Build configurations

| Configuration | Environment file | Used for |
|---|---|---|
| `development` (default) | `environment.ts` | `npm start` |
| `android` | `environment.android.ts` | `run-android.sh` |
| `ios` | `environment.ios.ts` | iOS builds |
| `docker` | `environment.docker.ts` | Docker / CI builds |

## Key dependencies

| Package | Purpose |
|---|---|
| `@ionic/angular` | Ionic UI components |
| `@capacitor/core` | Capacitor runtime |
| `@capacitor/ios` | iOS native platform |
| `@capacitor/android` | Android native platform |
| `@capacitor/app` | `appUrlOpen` event (OAuth2 callback) |
| `@capacitor/browser` | `Browser.open()` for OAuth2 and logout |

## Notes

- Same coding patterns as `angular-ui`: standalone components, signals, functional providers, strict templates, Prettier (100-char, single quotes)
- The `myapp://` redirect URI is registered in both identity providers and the Capacitor native projects — it will not resolve in a plain browser context
