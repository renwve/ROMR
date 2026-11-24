This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

# ROMR project context

## Design source

- Screens come from the Figma file `jES5BwcufjRkumN42iaI2r` ("ROMR---mcp"), **Redesign** section. Frames are named after screens (e.g. "Explore/Home - Food", "Saved - New Collection"); component sets after components (e.g. "Save Button", "Delete Button - Collection Card").
- Follow the designs exactly and don't add anything the design doesn't show. When a behaviour isn't in the design (timings, gestures), ask or keep it minimal, and say what you assumed.
- Colours, fonts and shadows are tokens in `src/constants/theme.ts`, named after the Figma variables (`blue900`, `white200`, `shadows.soft`…). Use them rather than hex values; a colour that isn't a Figma variable gets a comment saying so.
- Motion tokens live in `src/constants/motion.ts` (`PRESS_SCALE`, `SLIDE`, `SETTLE`, `rubberBand()`).
- Figma → React Native conversions that have caught us out:
  - Check whether a Figma stroke is inside the frame (doesn't change size) or adds to it, against the frame's dimensions.
  - Figma layer blurs don't render on Android: pre-render them to a PNG (see `assets/images/everything-collection.png`).
  - Figma corner smoothing (60%) uses `src/components/Squircle.tsx` (`react-native-fast-squircle`; plain rounded corners on web).

## Project layout

- `src/app/` routes only: `(tabs)/` is Explore / Planner / Saved / Account with the custom `NavBar`; `new-collection.tsx` sits on the root Stack above the tabs.
- `src/features/<feature>/` holds feature code (`explore`, `new-plan`, `saved`, `toast`), `src/components/` shared components, `src/hooks/` shared hooks.
- There's no backend yet. Content is placeholder data (`src/features/explore/content.ts`), and saved collections live in memory (`CollectionsContext`), so they're lost on reload.
- Reuse the shared pieces rather than rebuilding them: `ScalePressable` (press shrink), `WhiteButton`, `SaveButton`, `SwipeRow` (direction-locked horizontal pager), `RubberBandScrollView` (Android overscroll + fling bounce), `useDirectionLock`, `PageHeader` variants.
- Hearting a plan (`SaveButton`, `CategoryCard`) shows the Plan Saved toast through `useToast()`; the toast is drawn by `NavBar` so it can follow the bar's height.

## Running the app

- The app uses native modules that Expo Go doesn't include (`react-native-fast-squircle`, `expo-haptics`), so it runs as an **Android development build** (`expo-dev-client`, package `com.romr.app`). Expo Go won't work.
- Code changes only need the dev server (`npx expo start`). Adding or updating a library with native code needs a rebuild: `npx expo run:android`, or locally `npx expo prebuild --platform android` then `android/gradlew.bat assembleDebug`. `android/` is generated and git-ignored.
- The test phone (Galaxy S23) connects over wireless debugging (`adb pair` / `adb connect`), since its USB port doesn't work.

## Code conventions

- Formatting: single quotes, 100-character lines, `bracketSameLine`. There's no Prettier config in the repo, so a bare `npx prettier --write` switches files to double quotes: pass `--single-quote --print-width 100 --bracket-same-line`.
- React Compiler is on: read and write shared values with `.get()` / `.set()`, and keep render functions pure (no `Date.now()` and the like in render).
- Comments explain what the user sees and why, naming the Figma frame or component they implement.

## Reanimated / gesture pitfalls we've hit

- An animated style or animated props only re-run for shared values read **directly** inside them. A value reached through a helper function isn't tracked, so the style silently never updates: use `useDerivedValue` and read that.
- `withSpring` from a value to the same value is a no-op, even with a velocity; use `withSequence` for a bounce in place.
- Callbacks chained on a gesture that isn't built from `Gesture.` (e.g. `useDirectionLock(...)`) need an explicit `'worklet'` directive.
- Heavy React commits delay UI-thread animations. Keep big trees mounted rather than remounting them, and build expensive pages ahead of time (Explore builds its category pages during the launch splash).

## Git

- Work happens on `romr-redesign`. Commit only when asked, and don't push or merge (including with the `banana` branch) unless asked.
