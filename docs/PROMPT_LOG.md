# Prompt Log

## Prompt 1: Theme, fonts, strings and phone frame
**Date:** 18 Nov 2026
**Tool / model:** CodeGPT, Claude Opus 5.5
**Attached files:** README.md, package.json, tsconfig.json, src/app/_layout.tsx, src/app/index.tsx
**Prompt:**
```
You are helping me build a React Native mobile app called "Personal Finance Tracker" for a student project. I am a beginner, so keep the code simple, readable and commented in plain English, and explain what you did at the end.

First read the attached README.md: it is the full description of the app I am building. Follow it exactly and do not add features it doesn't mention.

PROJECT FACTS (do not change these)
- Expo SDK 58, Expo Router, TypeScript. Screens live in src/app. All other code lives in src/ (components, theme, storage, utils, strings).
- No backend. No new libraries. Do not edit package.json, .npmrc or app.json.
- These font packages are already installed: @expo-google-fonts/fraunces, @expo-google-fonts/instrument-sans, @expo-google-fonts/ibm-plex-mono, plus expo-font.
- The app is designed for a phone screen but I test it in a desktop browser with `npx expo start --web`.

FIRST, read these files before writing anything: package.json, tsconfig.json, src/app/_layout.tsx, src/app/index.tsx. Use the import alias defined in tsconfig.json if there is one; otherwise use relative imports. Before using any font name, open the installed font packages inside node_modules/@expo-google-fonts/ and confirm the exact exported names. Never guess font names.

TASK: build the visual foundation only (theme, fonts, phone frame). Create no other screens.

1. src/theme/colors.ts: export `colors` with exactly these values:
   paper #F5EFE0 (page background), paperDeep #EBE2CC (cards, inputs), ink #16261D (main text), inkSoft #4A5A4F (secondary text), forest #14452B (primary buttons, headers), income #1E7B4F, expense #B23A2A, gold #D9A33B (focus ring and accent), line #D8CDB1 (ruled lines), plus helpers: incomeTint #E3EEDF, expenseTint #F3DFD7, forestPressed #0F3420, disabled #C9C0A8.
   Never use pure black (#000) or pure white (#FFF) anywhere in the app. Text on a forest background uses `paper`.

2. src/theme/typography.ts: export the font family constants and these text style presets:
   - Fraunces (display): displayXL 44/48 weight 700, displayL 32/38 weight 600, title 22/28 weight 600
   - Instrument Sans (body): body 16/24 weight 400, bodyStrong 16/24 weight 600, label 13/18 weight 600 uppercase with letterSpacing 0.8, caption 13/18 weight 400
   - IBM Plex Mono (numbers): amount 17/24 weight 500, amountL 28/34 weight 600
   (format is fontSize/lineHeight). Each preset is a plain object with fontFamily, fontSize, lineHeight and, where needed, letterSpacing and textTransform, using the real exported font names.

3. src/theme/spacing.ts: export `spacing` (xs 4, sm 8, md 12, lg 16, xl 24, xxl 32, huge 48), `radius` (sm 8, md 12, lg 16) and `layout` with minTouchTarget 48 and maxContentWidth 480.

4. src/theme/index.ts: re-export everything as one `theme` import.

5. src/strings/en.ts: export a `strings` object with a `common` group for now: currency "FCFA", save "Save", cancel "Cancel", back "Back", loading "Loading…". More groups will be added in later steps. All app text must live in this file.

6. src/app/_layout.tsx: load the three font families with useFonts (only the weights used above). Keep the splash screen visible until the fonts are loaded (use expo-splash-screen if it is already in package.json; otherwise render nothing until loaded). Then render an Expo Router `Stack` with headerShown false and contentStyle backgroundColor paper. Wrap it in a "phone frame": a full-height View with width 100% and maxWidth layout.maxContentWidth, centered horizontally. On web, the area outside the frame uses paperDeep. Set the status bar so its icons are dark.

7. src/app/index.tsx: a temporary "design check" screen so I can verify the design visually: title "Design check" in displayL; a sample balance "102,300 FCFA" in displayXL with a 3px gold line under it; one row with Income "▲ + 150,000" in the income color and one with Expense "▼ − 60,000" in the expense color, both using the amount style; one body paragraph; one label; one forest button (pressed state uses forestPressed, minimum height 48, text color paper, and a visible gold focus ring on keyboard focus); one paperDeep card with a 1px line border. No hard-coded colors, font names or sizes in this file: use only the theme.

RULES
- Write short plain-English comments above each group of tokens (for example: "page background, the colour of the paper").
- No inline hex colors anywhere except src/theme/colors.ts.
- TypeScript must compile with no errors and no `any`.
- Create or change only the files listed above.

WHEN YOU FINISH: (a) list every file you created or changed, (b) explain each file in 2 to 3 simple sentences for a beginner, (c) tell me exactly what I should see in the browser, (d) list anything you were unsure about.
```
**What it changed:** Created src/theme/colors.ts, typography.ts, spacing.ts, index.ts and src/strings/en.ts. Edited src/app/_layout.tsx (fonts, splash screen, phone frame) and src/app/index.tsx (design-check screen).
**Problems / fixes:** The AI credits ran out right after the files were written, so I switched to the free DeepSeek V4.1 Flash model for the next prompts. After reviewing the code I found a `fontWeight` line on every text style that duplicated the weight already in the font name (for example Fraunces_700Bold) and removed those lines. Checked with `npx tsc --noEmit` (clean), searches for stray hex colors, pure black/white and `any` (none found), and in the browser.

---

## How to add the next entry
(Copy this block to the bottom of the file for every new prompt, then fill it in.)

## Prompt N: [short title]
**Date:**
**Tool / model:**
**Attached files:**
**Prompt:** (paste exactly what was sent)
**What it changed:**
**Problems / fixes:**