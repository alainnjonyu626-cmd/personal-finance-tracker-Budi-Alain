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

-
## Prompt 2A: Data types, money format and date helpers
**Date:** 19 Nov 2026
**Tool / model:** CodeGPT, DeepSeek V4.1 Flash
**Attached files:** docs/PROMPT_HEADER.md, README.md, src/strings/en.ts
**Prompt:**
```
Follow the rules in the attached docs/PROMPT_HEADER.md.

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

Create or change only these three files.
```
**What it changed:** Created src/types/models.ts, src/utils/money.ts and src/utils/dates.ts.
**Problems / fixes:** The model ran `npx expo lint`, which tried to install ESLint and edited package.json. It reverted the change itself and I confirmed with `git diff` that package.json was unchanged. I then added a rule to docs/PROMPT_HEADER.md forbidding lint and install commands. Dates avoid toISOString on purpose: it uses UTC and Douala is UTC+1, so near midnight it could give the wrong day.

## Prompt 2B: Validation helpers and error messages
**Date:** 19 Nov 2026
**Tool / model:** CodeGPT, DeepSeek V4.1 Flash
**Attached files:** docs/PROMPT_HEADER.md, README.md, src/strings/en.ts, src/utils/money.ts, src/utils/dates.ts
**Prompt:**
```
Follow the rules in the attached docs/PROMPT_HEADER.md.

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

Create or change only src/strings/en.ts and src/utils/validation.ts.
```
**What it changed:** Added the `errors` group to src/strings/en.ts and created src/utils/validation.ts (name, email, password, confirm password, report name, type, amount and date validators).
**Problems / fixes:** None. The model tested every required example in Node and `tsc` was clean. Decisions: minimum password length is 6 (the brief gives none); emails are normalized by the accounts service before saving; amounts that would become Infinity are rejected.

## Prompt 2C: Balance calculation helpers and visual test
**Date:** 19 Nov 2026
**Tool / model:** CodeGPT, DeepSeek V4.1 Flash
**Attached files:** docs/PROMPT_HEADER.md, README.md, src/types/models.ts, src/utils/money.ts, src/app/index.tsx
**Prompt:**
```
Follow the rules in the attached docs/PROMPT_HEADER.md.

TASK: balance helpers and a temporary visual test.

1. Create src/utils/balance.ts exporting:
   - calculateTotals(reports: Report[]): { totalIncome: number; totalExpenses: number; balance: number }. balance = totalIncome minus totalExpenses. Round each result to 2 decimals (Math.round(value * 100) / 100) to avoid floating point errors.
   - sortNewestFirst(reports: Report[]): Report[]. Returns a NEW array (never change the original), sorted by date descending, and when two dates are equal by createdAt descending. YYYY-MM-DD strings can be compared as text.
   - filterByUser(reports: Report[], userId: string): Report[]. Only the reports whose userId matches.
   Use the Report type from "@/types/models".

2. In src/app/index.tsx, ADD a clearly commented temporary section at the bottom of the design-check screen titled "Balance test (temporary)". It hard-codes these five reports (fake userId "test", fake ids, createdAt in increasing order) ONLY for this test:
   2026-11-01 Monthly salary income 150000
   2026-11-03 House rent expense 60000
   2026-11-07 Market shopping expense 18500
   2026-11-12 Freelance design job income 40000
   2026-11-15 Electricity bill expense 9200
   Compute calculateTotals on them and display: the balance with formatMoney, the total income, the total expenses, and one line "Expected: 102,300 FCFA" followed by "✅" if the balance is exactly 102300, otherwise "❌". Also display the names in newest-first order using sortNewestFirst (the first one shown must be "Electricity bill"). Use the theme for all styles. Plain text inside this temporary section is allowed. Do not change the rest of the screen.

Create or change only src/utils/balance.ts and src/app/index.tsx.
```
**What it changed:** Created src/utils/balance.ts (calculateTotals, sortNewestFirst, filterByUser) and added a temporary balance test card to src/app/index.tsx using the five example transactions from the brief.
**Problems / fixes:** The model's written summary said total expenses were 77,700 in one place and 87,700 in another. I checked the arithmetic (60,000 + 18,500 + 9,200 = 87,700) and the browser: the balance is exactly 102,300 FCFA with a green tick. Lesson: verify the screen, not only the AI's description.

## Prompt 3A: Storage and crypto helpers
**Date:** 19 Nov 2026
**Tool / model:** CodeGPT, DeepSeek V4.1 Flash
**Attached files:** docs/PROMPT_HEADER.md, README.md, src/types/models.ts
**Prompt:**
```
Follow the rules in the attached docs/PROMPT_HEADER.md.

TASK: local storage helpers and crypto helpers. No screens. The packages @react-native-async-storage/async-storage and expo-crypto are already installed.

1. Create src/storage/storage.ts:
   - export const STORAGE_KEYS = { users: "pft:users", resetCodes: "pft:resetCodes", reports: "pft:reports", session: "pft:session" } as const
   - readJSON<T>(key: string, fallback: T): Promise<T>. Reads AsyncStorage, parses JSON. If the key is missing, or reading or parsing fails for any reason, return the fallback. It must NEVER throw.
   - writeJSON(key: string, value: unknown): Promise<boolean>. Saves JSON. Returns true on success and false on any failure. It must NEVER throw.
   - removeKey(key: string): Promise<void>. Never throws.
   Use try/catch and short comments.

2. Create src/utils/crypto.ts using expo-crypto:
   - generateId(): string. Use Crypto.randomUUID().
   - generateSalt(): string. 16 random bytes from Crypto.getRandomBytes(16), converted to a lowercase hex string by hand (32 characters).
   - hashPassword(password: string, salt: string): Promise<string>. Returns Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, salt + password) (hex output).
   - generateResetCode(): string. A 6-digit numeric code, left-padded with zeros. Build it from Crypto.getRandomBytes(4) (combine the 4 bytes into one unsigned number, then take it modulo 1000000). Do NOT use Math.random.

Create only these two files.
```
**What it changed:** Created src/storage/storage.ts (readJSON, writeJSON, removeKey and the storage keys) and src/utils/crypto.ts (generateId, generateSalt, hashPassword, generateResetCode).
**Problems / fixes:** The model checked the Expo Crypto API names against the docs. A search for Math.random only matched two comments, not real code. Fixed a typo in a comment. Hashing needs a secure origin on web, so the app must be tested on localhost.


## Prompt 3B-test: Temporary accounts self-test
**Date:** 19 Nov 2026
**Tool / model:** CodeGPT, DeepSeek V4.1 Flash
**Attached files:** docs/PROMPT_HEADER.md, README.md, src/storage/auth.ts, src/storage/storage.ts, src/app/index.tsx
**Prompt:**
```
Follow the rules in the attached docs/PROMPT_HEADER.md.

TASK: a temporary self-test for the accounts service, shown on the design-check screen. Change only src/app/index.tsx.

Add a clearly commented temporary section "Accounts self-test (temporary)" with a button "Run accounts test". When pressed it runs these steps in order using the functions from "@/storage/auth", with the test email "selftest@example.com" and password "secret123", and shows each step on its own line with ✅ or ❌ plus a short label (plain English text is allowed in this temporary section). At the very start of the run, remove the keys STORAGE_KEYS.users, STORAGE_KEYS.resetCodes and STORAGE_KEYS.session (use removeKey from "@/storage/storage") so every run starts clean.

Steps and expected results:
1. registerUser(name "Test User", email "selftest@example.com", password "secret123") returns ok.
2. registerUser again with email "SelfTest@Example.com" (different capitals) returns ok false (duplicate).
3. loginUser("selftest@example.com", "secret123") returns ok.
4. loginUser("selftest@example.com", "wrongpass") returns ok false with the wrongCredentials message.
5. loginUser("nobody@example.com", "secret123") returns ok false with the SAME wrongCredentials message.
6. requestPasswordReset("nobody@example.com") returns ok false (emailNotFound).
7. requestPasswordReset("selftest@example.com") returns ok with a 6-digit code (check the code is exactly 6 digits). Keep the code.
8. resetPassword(email, "000000", "newpass456") returns ok false (wrong code; skip this step's real run if the real code happens to be "000000").
9. resetPassword(email, the real code, "newpass456") returns ok.
10. loginUser(email, "secret123") (the OLD password) returns ok false.
11. loginUser(email, "newpass456") returns ok.
12. resetPassword(email, the same real code again, "another789") returns ok false (a code works only once).
13. Check that the stored users list (readJSON on STORAGE_KEYS.users) contains no field holding the text "newpass456" or "secret123" anywhere (convert it to a string with JSON.stringify and check it does not include either word).

At the end show "All steps passed ✅" or "Some steps failed ❌". Do not change the other parts of the screen. Use theme styles only.
```
**What it changed:** Edited src/app/index.tsx: added an AccountsSelfTest component and two small button styles under the balance test. It clears the users, reset codes and session keys, then runs the 13 steps and shows a tick or cross on each.
**Problems / fixes:** The model built this together with Prompt 3B. Its own headless-browser run showed all steps passing; my own run in my browser: (write what you saw, for example "13 ticks, All steps passed"). The heading shows in capitals because the theme label style is uppercase. This card is temporary and is deleted when the real screens exist.

## Prompt 3C: Reports service
**Date:** 19 Nov 2026
**Tool / model:** CodeGPT, DeepSeek V4.1 Flash
**Attached files:** docs/PROMPT_HEADER.md, README.md, src/types/models.ts, src/storage/storage.ts, src/utils/crypto.ts, src/utils/validation.ts, src/utils/dates.ts, src/utils/balance.ts, src/strings/en.ts
**Prompt:**
```
Follow the rules in the attached docs/PROMPT_HEADER.md.

TASK: the reports service. No screens.

Create src/storage/reports.ts. Reports are stored as ONE array under STORAGE_KEYS.reports. Every function never throws (use try/catch) and returns saveFailed (from strings.errors) on unexpected errors. Check that writeJSON returned true. Use the Report, TransactionType and ServiceResult types from "@/types/models".

export type ReportInput = { name: string; type: TransactionType; amount: number; date: string }

Exports:
- getUserReports(userId: string): Promise<Report[]>. Returns only that user's reports, newest first (use filterByUser and sortNewestFirst from "@/utils/balance"). On any error return an empty array.
- getReport(userId: string, reportId: string): Promise<Report | null>. Returns null unless the report exists AND belongs to userId.
- addReport(userId: string, input: ReportInput): Promise<ServiceResult<Report>>. First check the input again: name (trimmed) not empty, type is "income" or "expense", amount is a finite number greater than 0, date passes isValidISODate. Return the matching message from strings.errors if something is wrong. Then round the amount to 2 decimals, trim the name, create the report (id from generateId, userId, createdAt Date.now()), save, and return it.
- updateReport(userId: string, reportId: string, input: ReportInput): Promise<ServiceResult<Report>>. Same checks. Only update a report that belongs to userId, keeping its id, userId and createdAt. If not found or not owned, return saveFailed.
- deleteReport(userId: string, reportId: string): Promise<ServiceResult<true>>. Only deletes a report that belongs to userId.

Create only src/storage/reports.ts.
```
**What it changed:** Created src/storage/reports.ts with ReportInput and getUserReports, getReport, addReport, updateReport and deleteReport. Every function takes a userId, so one user can never read, edit or delete another user's report.
**Problems / fixes:** None. The model did not run lint or install packages. Notes: a missing or not-owned report returns saveFailed; the service checks that the amount is above 0 but not the maximum (the screens use validateAmount first); an empty date returns dateInvalid.


## Prompt 4A: Reusable components (fields, button, banner)
**Date:** 19 Nov 2026
**Tool / model:** CodeGPT, DeepSeek V4.1 Flash
**Attached files:** docs/PROMPT_HEADER.md, README.md, src/theme/index.ts, src/theme/colors.ts, src/theme/typography.ts, src/theme/spacing.ts, src/strings/en.ts, src/app/index.tsx
**Prompt:**
```
Follow the rules in the attached docs/PROMPT_HEADER.md.

TASK: four reusable UI components plus a temporary visual check. Use only the theme (colors, typography, spacing, radius, layout) and strings. No other screens.

1. In src/strings/en.ts add to the existing `common` group (keep every existing key): show: "Show", hide: "Hide", showPassword: "Show password", hidePassword: "Hide password".

2. Create src/components/TextField.tsx. Props: label: string; value: string; onChangeText: (text: string) => void; error?: string | null; helper?: string; placeholder?: string; keyboardType?: KeyboardTypeOptions; autoCapitalize?: "none" | "sentences" | "words"; autoComplete?: TextInputProps["autoComplete"]; secureTextEntry?: boolean; editable?: boolean; returnKeyType?: ReturnKeyTypeOptions; onSubmitEditing?: () => void; rightElement?: ReactNode.
   - Layout: the label above (typography.label, colors.inkSoft), then the input box, then the helper or error text below.
   - Input box: minHeight layout.minTouchTarget, backgroundColor colors.paperDeep, 1px colors.line border, radius.md, horizontal padding spacing.lg, text typography.body in colors.ink, placeholderTextColor colors.inkSoft. rightElement sits inside the box on the right.
   - Focus: when focused show a gold ring using colors.gold, drawn OUTSIDE the box with the same outline technique as the Save button in src/app/index.tsx (outlineWidth 2, outlineStyle solid, outlineColor transparent until focused, outlineOffset 2), so the box never changes size. Turn off the browser's default outline on the input itself.
   - Error state: the border becomes colors.expense and the error text appears under the box in typography.caption and colors.expense, starting with "⚠ " so it is not shown by colour alone. Give that text accessibilityRole="alert". When there is an error, show it instead of the helper text.
   - Accessibility: accessibilityLabel equals the label; on web also pass aria-invalid when there is an error.

3. Create src/components/PasswordField.tsx: uses TextField with secureTextEntry controlled by a "Show" / "Hide" Pressable placed as the rightElement. The Pressable is at least layout.minTouchTarget tall, uses typography.bodyStrong in colors.forest, and has accessibilityRole="button" and an accessibilityLabel from strings.common.showPassword / hidePassword. It accepts the same props as TextField except secureTextEntry and rightElement.

4. Create src/components/Button.tsx. Props: title: string; onPress: () => void; variant?: "primary" | "secondary" | "danger" (default "primary"); disabled?: boolean; loading?: boolean; accessibilityLabel?: string.
   - minHeight layout.minTouchTarget, radius.md, centered text in typography.bodyStrong.
   - primary: background colors.forest, text colors.paper, pressed colors.forestPressed.
   - secondary: transparent background, 1.5px colors.forest border, text colors.forest, pressed background colors.paperDeep.
   - danger: background colors.expense, text colors.paper, pressed opacity 0.85.
   - disabled or loading: background colors.disabled, text colors.inkSoft, presses ignored. While loading show an ActivityIndicator (color colors.inkSoft) instead of the title.
   - Keyboard focus ring in colors.gold exactly like the Save button in src/app/index.tsx (no size change).
   - accessibilityRole="button" and accessibilityState { disabled, busy: loading }.

5. Create src/components/Banner.tsx. Props: message?: string | null; tone?: "error" | "success" (default "error"). Renders nothing when message is empty. error: background colors.expenseTint, 1px colors.expense border, text colors.expense, prefix "⚠ ". success: background colors.incomeTint, 1px colors.income border, text colors.income, prefix "✓ ". radius.md, padding spacing.md, typography.body, accessibilityRole="alert".

6. Create src/components/index.ts that re-exports TextField, PasswordField, Button and Banner.

7. In src/app/index.tsx ADD a clearly commented temporary section "Components check (temporary)" at the bottom of the screen (do not change the rest). It shows: a TextField with its own useState value (label "Name"); a PasswordField with state (label "Password", helper "At least 6 characters"); a TextField in the error state (label "Email", error "That email doesn't look right. Example: name@example.com"); a primary Button, a secondary Button and a danger Button; a disabled primary Button; a primary Button with loading; an error Banner and a success Banner. Plain English text is allowed in this temporary section.

Create or change only the files named above.
```
**What it changed:** Created src/components/TextField.tsx, PasswordField.tsx, Button.tsx, Banner.tsx and index.ts. Added show/hide strings to src/strings/en.ts and a temporary Components check card to src/app/index.tsx.
**Problems / fixes:** The model found and fixed two problems by looking at the page: a black browser focus box inside the focused input (now removed on web only), and a loading button with no spoken name (it now falls back to the title). It reported a focus-ring quirk when clicking between fields; I tested it myself: (write what you saw).


## Prompt 4B: Login session and route guards
**Date:** 19 Nov 2026
**Tool / model:** CodeGPT, DeepSeek V4.1 Flash
**Attached files:** docs/PROMPT_HEADER.md, README.md, src/app/_layout.tsx, src/storage/auth.ts, src/types/models.ts, src/strings/en.ts, src/components/index.ts, src/theme/index.ts
**Before sending:** I moved the old design-check screen with `git mv src/app/index.tsx src/app/dev-check.tsx` so the model does not have to copy a large file.
**Prompt:**
```
Follow the rules in the attached docs/PROMPT_HEADER.md.

TASK: login session state and route guards. The screens are only placeholders for now (a title and links); they are filled in by later prompts. The old design-check screen was already moved to src/app/dev-check.tsx: do not touch it.

1. In src/strings/en.ts add a new group `screens` (keep every existing group and key): appName: "Personal Finance Tracker", login: "Log in", register: "Create account", forgotPassword: "Forgot password", resetPassword: "Reset password", reports: "Previous reports", addReport: "Add report", editReport: "Edit report", logout: "Log out", hello: "Hello", comingSoon: "This screen is built in the next step."

2. Create src/context/AuthContext.tsx:
   - AuthProvider({ children }) holds `user: SessionUser | null` and `loading: boolean` (true at the start). On first mount call loadSession() from "@/storage/auth", set the user, then set loading to false (also set loading to false if it throws).
   - signIn(user: SessionUser, remember: boolean): Promise<void>. Calls saveSession(user, remember), then setUser(user).
   - signOut(): Promise<void>. Calls clearSession(), then setUser(null).
   - export function useAuth() returning { user, loading, signIn, signOut }. It throws a clear Error if used outside AuthProvider.
   - Use the SessionUser type from "@/types/models". Short plain-English comments.

3. Edit src/app/_layout.tsx: wrap the existing <Stack> in <AuthProvider>. Change nothing else (fonts, splash screen and phone frame stay exactly as they are).

4. Create src/app/index.tsx: while loading return null; if there is a user return <Redirect href="/reports" />, otherwise <Redirect href="/login" /> (Redirect from "expo-router").

5. Create src/app/(auth)/_layout.tsx: while loading return null; if a user exists return <Redirect href="/reports" />; otherwise a Stack with headerShown false and contentStyle backgroundColor colors.paper.

6. Create src/app/(app)/_layout.tsx: while loading return null; if there is no user return <Redirect href="/login" />; otherwise a Stack with headerShown false and contentStyle backgroundColor colors.paper.

7. Create these placeholder screens. Each is a default export on a colors.paper background with spacing.xl padding, a title in typography.displayL and colors.ink taken from strings.screens, and one line strings.screens.comingSoon in typography.body and colors.inkSoft. Every Link has typography.bodyStrong, colors.forest and minHeight layout.minTouchTarget:
   - src/app/(auth)/login.tsx: Links to "/register" (text strings.screens.register) and "/forgot-password" (text strings.screens.forgotPassword).
   - src/app/(auth)/register.tsx: a Link back to "/login" (text strings.screens.login).
   - src/app/(auth)/forgot-password.tsx: a Link to "/reset-password" and a Link back to "/login".
   - src/app/(auth)/reset-password.tsx: a Link back to "/login".
   - src/app/(app)/reports.tsx: shows `${strings.screens.hello}, ${user.name}` from useAuth, a Link to "/add-report", and a Button (from "@/components") titled strings.screens.logout that calls signOut. Do not navigate by hand: the guard redirects after signOut.
   - src/app/(app)/add-report.tsx: a Link back to "/reports".
   - src/app/(app)/edit-report/[id].tsx: shows the id from useLocalSearchParams (handle string | string[]) and a Link back to "/reports".

RULES: no `any`, no type casts to silence errors. If TypeScript complains that a route does not exist, stop and tell me instead of working around it.

Create or change only the files named above.
```
**What it changed:** Created src/context/AuthContext.tsx (AuthProvider, useAuth, signIn, signOut), src/app/index.tsx (redirects), the (auth) and (app) route group layouts that guard the screens, and placeholder screens for login, register, forgot-password, reset-password, reports, add-report and edit-report/[id]. Added the `screens` strings group and wrapped the layout in AuthProvider. The old design-check screen was moved to src/app/dev-check.tsx.
**Problems / fixes:** The route types were out of date, so TypeScript rejected every route; the model regenerated them with Expo's own generator (a git-ignored file). The model also ran `npx expo lint` against the header rule. It reported creating and deleting eslint.config.js. I checked that package.json, package-lock.json and git status are unchanged. From now on the lint ban is also written inside each prompt.


## Prompt 5A: Register and Login screens
**Date:** 19 Nov 2026
**Tool / model:** CodeGPT, DeepSeek V4.1 Flash
**Attached files:** docs/PROMPT_HEADER.md, README.md, src/strings/en.ts, src/theme/index.ts, src/components/index.ts, src/components/TextField.tsx, src/components/PasswordField.tsx, src/context/AuthContext.tsx, src/storage/auth.ts, src/utils/validation.ts, src/app/(auth)/login.tsx, src/app/(auth)/register.tsx
**Prompt:**
```
Follow the rules in the attached docs/PROMPT_HEADER.md. HARD RULE: do not run `npx expo lint`, `npx expo install`, `npm install`, `npx eslint` or any command that installs or changes packages or config files. Only edit the files I name. If TypeScript complains about a route, stop and tell me.

TASK: build the real Login and Register screens. Both use the existing components from "@/components", the validators from "@/utils/validation", the services from "@/storage/auth" and useAuth from "@/context/AuthContext". All words come from src/strings/en.ts and all styling from the theme.

1. In src/strings/en.ts add a new group `auth` (keep every existing group and key): loginSubtitle: "Welcome back. Your money notebook is waiting.", registerSubtitle: "Create your account to start tracking your money.", nameLabel: "Full name", emailLabel: "Email", passwordLabel: "Password", confirmLabel: "Confirm password", rememberMe: "Remember me", loggingIn: "Logging in…", creating: "Creating account…", noAccount: "No account yet?", haveAccount: "Already have an account?", forgotLink: "Forgot password?", accountCreated: "Account created. Please log in.", passwordHelper: "At least 6 characters".

2. Replace src/app/(auth)/login.tsx with the real Login screen (default export):
   - A ScrollView with keyboardShouldPersistTaps="handled", colors.paper background, spacing.xl padding, and a content column that is centered vertically when there is room.
   - Header: strings.screens.appName in typography.displayL (colors.ink), a 3px colors.gold rule about spacing.huge wide under it, then strings.auth.loginSubtitle in typography.body and colors.inkSoft.
   - If the route param `registered` equals "1" (useLocalSearchParams) show a success Banner with strings.auth.accountCreated above the form.
   - Form: TextField for email (keyboardType "email-address", autoCapitalize "none", autoComplete "email"), PasswordField (autoComplete "current-password"), a "Remember me" checkbox row (a Pressable with a 24px box, colors.forest border, filled colors.forest with a "✓" in colors.paper when checked, a label in typography.body, accessibilityRole="checkbox", accessibilityState { checked }, row height at least layout.minTouchTarget, gold keyboard focus ring like the Button), an error Banner for service errors, and a primary Button strings.screens.login (title strings.auth.loggingIn and loading while working).
   - Behaviour: on submit, first validate email (validateEmail) and password (validateRequired: use validatePassword's "empty" case only, so show strings.errors.passwordRequired for an empty password but do NOT show the too-short message at login). Show the messages under the fields and do not call the service if anything is invalid. Otherwise call loginUser(email, password). On failure show the service error in the Banner. On success call signIn(user, remember). Do NOT navigate by hand: the (auth) layout redirects to /reports once the user is set.
   - Editing a field clears that field's error and the Banner. The last field's onSubmitEditing submits the form. Pressing the button twice must not run two requests (ignore while loading).
   - Under the form: a row with strings.auth.noAccount and a Link to "/register" (text strings.screens.register), and a Link to "/forgot-password" (text strings.auth.forgotLink). All links typography.bodyStrong, colors.forest, minHeight layout.minTouchTarget.

3. Replace src/app/(auth)/register.tsx with the real Register screen (default export), same layout and header style with strings.auth.registerSubtitle:
   - Fields: full name (autoCapitalize "words", autoComplete "name"), email, PasswordField with helper strings.auth.passwordHelper (autoComplete "new-password"), PasswordField for confirm password (strings.auth.confirmLabel).
   - Behaviour: on submit run validateName, validateEmail, validatePassword and validateConfirmPassword(password, confirm), show all messages under their fields, and stop if any exists. Otherwise call registerUser({ name, email, password }). On failure show the service error in the Banner (for example the duplicate email message). On success use router.replace with pathname "/login" and params { registered: "1" } (router from "expo-router"). Do NOT sign the user in.
   - Same rules: editing clears errors, last field submits, double presses ignored while loading, button title strings.auth.creating while loading.
   - Under the form: strings.auth.haveAccount and a Link to "/login" (text strings.screens.login).

Create or change only src/strings/en.ts, src/app/(auth)/login.tsx and src/app/(auth)/register.tsx.
```
**What it changed:** Added the `auth` strings group to src/strings/en.ts and replaced the placeholder login and register screens with the real ones: validation, service errors in a Banner, a Remember me checkbox, and a success message on Login after registering.
**Problems / fixes:** The model ran no lint or install commands. It could not confirm from code that the gold focus ring shows on the Remember me row, so I tested it in the browser. Register, login, wrong password, remember me and logout all passed my browser test. Login only checks that the password is not empty; password length is enforced at Register and Reset.


## Prompt 5B: Forgot Password and Recover Password screens
**Date:** 19 Nov 2026
**Tool / model:** CodeGPT, DeepSeek V4.1 Flash
**Attached files:** docs/PROMPT_HEADER.md, README.md, src/strings/en.ts, src/theme/index.ts, src/components/index.ts, src/components/TextField.tsx, src/components/PasswordField.tsx, src/storage/auth.ts, src/utils/validation.ts, src/app/(auth)/login.tsx, src/app/(auth)/forgot-password.tsx, src/app/(auth)/reset-password.tsx
**Prompt:**
```
Follow the rules in the attached docs/PROMPT_HEADER.md. HARD RULE: do not run `npx expo lint`, `npx expo install`, `npm install`, `npx eslint` or any command that installs or changes packages or config files. Only edit the files I name. If TypeScript complains about a route, stop and tell me.

TASK: build the real Forgot Password and Recover (Reset) Password screens. Copy the layout, header style (app title in typography.displayL, 3px colors.gold rule, subtitle), ScrollView settings, link styling and form behaviour patterns from the attached src/app/(auth)/login.tsx so all screens look the same. Use components from "@/components", validators from "@/utils/validation" and the services from "@/storage/auth". All words come from src/strings/en.ts, all styling from the theme.

1. In src/strings/en.ts add these keys to the existing `auth` group (keep every existing key and group): forgotSubtitle: "Enter your registered email and we will give you a reset code.", resetSubtitle: "Enter the code and choose a new password.", sendCode: "Send reset code", sending: "Sending…", codeLabel: "Reset code", newPasswordLabel: "New password", confirmNewLabel: "Confirm new password", resetting: "Resetting…", yourCode: "Your reset code", codeNote: "In a real app this code would be sent to your email.", validForPrefix: "Valid for", minutesWord: "minutes", continue: "Continue", needNewCode: "Need a new code?", backToLogin: "Back to log in", passwordUpdated: "Password updated. Please log in with your new password."

2. Replace src/app/(auth)/forgot-password.tsx (default export):
   - Header with strings.screens.forgotPassword as the title and strings.auth.forgotSubtitle.
   - One email TextField (same props as on the login screen), an error Banner for service errors, and a primary Button strings.auth.sendCode (title strings.auth.sending and loading while working).
   - On submit: validateEmail first and show its message under the field (do not call the service if invalid). Otherwise call requestPasswordReset(email). On failure show the service error in the Banner (this includes the helpful "email not found" message). On success keep the email in state and show a "code card" below the form: a View with background colors.paperDeep, a 2px colors.gold border, radius.md and padding spacing.lg containing the label strings.auth.yourCode (typography.label, colors.inkSoft), the code in typography.amountL and colors.ink with letterSpacing 4, the line `${strings.auth.validForPrefix} ${RESET_CODE_MINUTES} ${strings.auth.minutesWord}` (RESET_CODE_MINUTES is exported by "@/storage/auth") in typography.caption and colors.inkSoft, and strings.auth.codeNote in typography.caption and colors.inkSoft. Under the card a primary Button strings.auth.continue that calls router.push({ pathname: "/reset-password", params: { email } }). Never put the code in the route params.
   - Editing the email clears its error, the Banner and any shown code card. Pressing submit again simply creates a new code. Double presses are ignored while loading. The email field's onSubmitEditing submits.
   - A Link back to "/login" with text strings.auth.backToLogin (typography.bodyStrong, colors.forest, minHeight layout.minTouchTarget).

3. Replace src/app/(auth)/reset-password.tsx (default export):
   - Header with strings.screens.resetPassword and strings.auth.resetSubtitle.
   - Read the `email` route param with useLocalSearchParams (handle string | string[]) and use it as the starting value of the email field (the user can still edit it).
   - Fields in this order: email TextField, reset code TextField (label strings.auth.codeLabel, keyboardType "number-pad", autoCapitalize "none"), PasswordField for the new password (label strings.auth.newPasswordLabel, helper strings.auth.passwordHelper, autoComplete "new-password"), PasswordField for confirming (label strings.auth.confirmNewLabel). An error Banner, and a primary Button with the title strings.screens.resetPassword (title strings.auth.resetting and loading while working).
   - On submit run validateEmail, validateResetCode, validatePassword and validateConfirmPassword(newPassword, confirm), show every message under its own field, and stop if any exists. Otherwise call resetPassword(email, code, newPassword). On failure show the service error in the Banner (wrong code, expired code or email not found). On success use router.replace({ pathname: "/login", params: { reset: "1" } }).
   - Editing a field clears that field's error and the Banner. The last field's onSubmitEditing submits. Double presses are ignored while loading.
   - Two Links under the form: strings.auth.needNewCode to "/forgot-password" and strings.auth.backToLogin to "/login" (same link style).

4. Edit src/app/(auth)/login.tsx with the smallest change possible: when the route param `reset` equals "1", show a success Banner with strings.auth.passwordUpdated in the same place where the existing `registered` banner is shown (only one banner at a time; if both params were present show the registered one). Change nothing else in that file.

Create or change only src/strings/en.ts, src/app/(auth)/forgot-password.tsx, src/app/(auth)/reset-password.tsx and src/app/(auth)/login.tsx.
```
**What it changed:** (fill in after the model finishes)
**Problems / fixes:** (fill in after checks)