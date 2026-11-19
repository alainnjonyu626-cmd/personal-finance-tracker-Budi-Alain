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

-## Prompt 2A: Data types, money format and date helpers
**Date:** 19 Nov 2026
**Tool / model:** CodeGPT, DeepSeek V4.1 Flash
**Attached files:** docs/PROMPT_HEADER.md, README.md, src/strings/en.ts
**Prompt:** (Follow the rules in the attached docs/PROMPT_HEADER.md.

TASK: data types and formatting helpers. No screens.

1. Create src/types/models.ts exporting:
   - type TransactionType = "income" | "expense"
   - interface Report { id: string; userId: string; name: string; type: TransactionType; amount: number; date: string (format "YYYY-MM-DD"); createdAt: number (milliseconds timestamp) }
   - interface User { id: string; name: string; email: string (always stored lowercase); passwordHash: string; salt: string; createdAt: number }
   Add a short comment on each field.

2. Create src/utils/money.ts exporting:
   - formatAmount(value: number): string. Comma thousands separator; whole numbers show no decimals; other numbers show up to 2 decimals; negative numbers start with the real minus sign "−" (U+2212). Do NOT use Intl or toLocaleString: write it by hand so it is identical on every device.
   - formatMoney(value: number): string. Same as formatAmount plus a space and strings.common.currency.
   - signedAmount(type: TransactionType, amount: number): string. Income gives "+ " plus formatAmount; expense gives "− " plus formatAmount.
   Required results: formatAmount(102300) = "102,300"; formatAmount(18500) = "18,500"; formatAmount(0) = "0"; formatAmount(1234.5) = "1,234.5"; formatAmount(-5000) = "−5,000"; formatMoney(102300) = "102,300 FCFA"; signedAmount("income", 150000) = "+ 150,000"; signedAmount("expense", 60000) = "− 60,000".

3. Create src/utils/dates.ts exporting:
   - toISODate(date: Date): string. Build "YYYY-MM-DD" from the LOCAL year, month and day. Do NOT use toISOString (it uses UTC and can give the wrong day).
   - todayISO(): string
   - isValidISODate(value: string): boolean. Must match YYYY-MM-DD exactly AND be a real calendar date.
   - formatDisplayDate(value: string): string. "2026-11-01" becomes "01 Nov 2026". Use a hand-written list of month names Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec. No Intl.
   Required results: toISODate(new Date(2026, 10, 1)) = "2026-11-01"; isValidISODate("2026-02-30") = false; isValidISODate("2026-11-1") = false; isValidISODate("2026-11-15") = true; formatDisplayDate("2026-11-01") = "01 Nov 2026".

Create or change only these three files.)
**What it changed:** Created src/types/models.ts, src/utils/money.ts and src/utils/dates.ts.
**Problems / fixes:** The model ran `npx expo lint`, which tried to install ESLint and edited package.json. It reverted the change itself; I confirmed with `git diff` that package.json is unchanged. I added a rule to the prompt header forbidding lint and install commands. toISOString is avoided on purpose, because it uses UTC and Douala is UTC+1, so near midnight it could give the wrong day.

## Prompt 2B: Validation helpers and error messages
**Date:** 19 Nov 2026
**Tool / model:** CodeGPT, DeepSeek V4.1 Flash
**Attached files:** docs/PROMPT_HEADER.md, README.md, src/strings/en.ts, src/utils/money.ts, src/utils/dates.ts
**Prompt:** (Follow the rules in the attached docs/PROMPT_HEADER.md.

TASK: validation helpers and error messages. No screens.

1. In src/strings/en.ts add a group `errors` with exactly these keys and texts:
   nameRequired: "Please enter your name."
   emailRequired: "Please enter your email."
   emailInvalid: "That email doesn't look right. Example: name@example.com"
   passwordRequired: "Please enter a password."
   passwordTooShort: "Your password must have at least 6 characters."
   confirmRequired: "Please confirm your password."
   passwordsMismatch: "The two passwords don't match."
   reportNameRequired: "Please enter a name for this report."
   typeRequired: "Please choose Income or Expense."
   amountRequired: "Please enter an amount."
   amountInvalid: "The amount must be a number, like 18500."
   amountNotPositive: "The amount must be greater than 0."
   amountTooLarge: "That amount is too large."
   dateRequired: "Please choose a date."
   dateInvalid: "That date isn't valid. Use the format YYYY-MM-DD."
   codeRequired: "Please enter the reset code."
   Keep the existing `common` group unchanged.

2. Create src/utils/validation.ts. Every validator takes strings and returns `string | null`: the error message from strings.errors, or null when the input is fine. Always trim the input first.
   - normalizeEmail(email): trims and lowercases.
   - validateName(value): not empty.
   - validateEmail(value): not empty, then must match /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.
   - validatePassword(value): not empty, at least 6 characters. Do NOT trim passwords (spaces count).
   - validateConfirmPassword(password, confirm): confirm not empty, and must equal password exactly.
   - validateReportName(value): not empty.
   - validateType(value): must be exactly "income" or "expense".
   - parseAmount(raw: string): number | null. Remove commas and spaces, then accept only the pattern /^-?\d+(\.\d{1,2})?$/ and return the number; otherwise null.
   - validateAmount(raw): empty gives amountRequired; text that is not a number (letters, "1e5", "NaN", "12abc") gives amountInvalid; a number <= 0 (including negatives and 0) gives amountNotPositive; a number above 999999999 gives amountTooLarge; otherwise null.
   - validateDate(raw): empty gives dateRequired; not a real YYYY-MM-DD date (use isValidISODate) gives dateInvalid.
   - validateResetCode(value): not empty.

   Required results: validateAmount("18,500") = null; validateAmount("18500") = null; validateAmount("0") = amountNotPositive; validateAmount("-50") = amountNotPositive; validateAmount("abc") = amountInvalid; validateAmount("") = amountRequired; validateAmount("1000000000") = amountTooLarge; validateEmail("Budi@Mail.com") = null; validateEmail("budi@") = emailInvalid; validatePassword("12345") = passwordTooShort; parseAmount("18,500") = 18500.

Create or change only src/strings/en.ts and src/utils/validation.ts.)
**What it changed:** Added the `errors` group to src/strings/en.ts and created src/utils/validation.ts (name, email, password, confirm password, report name, type, amount and date validators).
**Problems / fixes:** None. The model tested every required example in Node and `tsc` is clean. Decisions: minimum password length 6 (the brief gives none); emails are normalized by the accounts service before saving; amounts that become Infinity are rejected.