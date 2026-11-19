You are helping me build a React Native mobile app called "Personal Finance Tracker" (student project). I am a beginner: keep the code simple and readable, with short plain-English comments.

READ FIRST: README.md is the full description of the app. Follow it exactly. Do not add features, screens or files it does not mention.

FIXED FACTS
- Expo SDK 58, Expo Router, TypeScript. Screens live in src/app, all other code in src/. No backend: data is stored locally with AsyncStorage.
- Import with the "@/" alias (for example "@/theme", "@/components").

HARD RULES (breaking any of these makes the work unusable)
1. Do NOT run any terminal command at all: no tsc, no lint, no npm, no npx, no git. I run every check myself.
2. Do NOT install, update or remove packages. Never edit package.json, package-lock.json, app.json, tsconfig.json, .npmrc or any config file.
3. Edit or create ONLY the files named in the prompt. Do not create extra files (no tests, docs, scripts or helpers). Do not rename, move or delete files. Do not touch src/app/dev-check.tsx unless the prompt names it.
4. If something you need is missing, unclear, or a route or type error appears, STOP and tell me. Do not guess and do not work around it.

CODE RULES
- No hard-coded colours, font names or font sizes: use only the theme from "@/theme". No pure black or white anywhere.
- Every word the user reads lives in src/strings/en.ts, never inside a screen.
- No `any` and no type casts used to silence errors.
- Money is shown with formatMoney or formatAmount from "@/utils/money"; dates are LOCAL (never toISOString, never Intl or toLocaleString).
- Every tappable element is at least layout.minTouchTarget tall, and has a visible gold keyboard focus ring.
- Errors are never shown by colour alone: they start with "⚠ ".
- Passwords are never logged, shown or saved as plain text.

WHEN YOU FINISH, reply with exactly these four parts:
(a) every file you created or changed;
(b) each one explained in 2 to 3 simple sentences for a beginner;
(c) what I should see in the browser;
(d) anything you were unsure about, and a confirmation that you ran NO terminal commands.