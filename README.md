# Personal Finance Tracker

A React Native (Expo) mobile app where a user signs in, records each income or expense by hand, and always sees their current balance. Built for a phone screen, tested in the browser. Currency: FCFA.

## Tech
- React Native with Expo SDK 58, Expo Router (screens in `src/app`), TypeScript
- No backend: all data (users, reset codes, reports) is stored locally with AsyncStorage
- Passwords are never stored as plain text (salted hash with expo-crypto)
- Fonts: Fraunces (headings), Instrument Sans (text), IBM Plex Mono (amounts)

## What the app does
A personal money notebook. The user records transactions and the app calculates the balance: total income minus total expenses. The balance is never typed by hand.

### One transaction (report)
| Field | Rule |
|---|---|
| Name | Required text, e.g. "Salary", "Taxi fare" |
| Type | Required: Income or Expense |
| Amount | Required number greater than 0 |
| Date | Required, defaults to today, can be changed |
| Balance | Calculated, never typed. Updates after every add, edit or delete |

### Screens
1. **Login / Register**: name, email, password, confirm password. Rejects empty fields, invalid emails, mismatched passwords and duplicate accounts. Clear error for a wrong email or password.
2. **Forgot Password**: user enters their registered email, a reset code is generated and shown on screen. Unknown email shows a helpful message.
3. **Recover Password**: user enters the code and a new password twice. Wrong or expired codes are rejected. The old password stops working.
4. **Previous Reports (dashboard)**: balance, total income and total expenses at the top, then every report newest first. Income and expense are clearly different (sign, arrow and color). Each user sees only their own reports.
5. **Add Report**: name, type, amount, date, with validation. After saving, returns to the list with the balance updated.
6. **Edit Report**: opened from the list, pre-filled, same validation. Cancel changes nothing.

### Bonus features
Delete a report (with confirmation), search and filter reports, monthly income vs expense summary chart, export to CSV and PDF, logout and "remember me".

## Design direction
A warm "ledger" look: cream paper background, ink-green text, forest-green buttons, a gold accent. Income is green with a + and an up arrow, expense is red with a minus and a down arrow, so they are never told apart by color alone. All colors, fonts and spacing live in `src/theme`, and all text lives in `src/strings`.

## Project structure
```
src/
  app/          screens (one file = one screen)
  components/   small reusable pieces
  theme/        colors, fonts, spacing
  storage/      AsyncStorage helpers
  utils/        validation, money format, balance maths
  strings/      all app text
docs/           prompt log and reflection
```

## How to install
```
npm install
```

## How to run
```
npx expo start --web
```

## Test login
(to be added once Register and Login are built)

## Note
This project uses a `.npmrc` file with `legacy-peer-deps=true`. Run `npm install` as usual.