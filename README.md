# Personal Finance Tracker

A React Native (Expo) mobile app where a user signs in, records each income or expense by hand, and always sees their current balance. Built for a phone screen and tested in the browser. Currency: FCFA.

## Features
- **Register and Login:** name, email, password and confirm password. Empty fields, invalid emails, mismatched passwords and duplicate accounts are rejected, and a wrong email or password shows a clear error.
- **Passwords are never stored as plain text:** each password is saved as a salted SHA-256 hash.
- **Forgot Password:** the user enters a registered email and a 6-digit reset code is shown on screen (valid for 10 minutes). An unknown email shows a helpful message.
- **Recover Password:** the user enters the code and a new password twice. Wrong or expired codes are rejected, a code works only once, and the old password stops working.
- **Previous Reports (dashboard):** current balance, total income and total expenses at the top, then every report, newest first. Income shows a green ▲ and "+", expenses a red ▼ and "−". Each user sees only their own reports.
- **Add Report and Edit Report:** name, type (Income or Expense), amount (greater than 0) and date (defaults to today). Cancel changes nothing.
- **Balance:** calculated as total income minus total expenses. It is never typed and updates after every add or edit.
- **Data survives a reload:** everything is stored in the browser with AsyncStorage.

### Bonus features
### Bonus features
- Logout
- Remember me (keeps the user logged in after a reload)
- Hide or show the balance (the choice is remembered after a reload)

## Tech
- React Native with Expo SDK 58, Expo Router (one file in `src/app` is one screen), TypeScript
- No backend: users, reset codes, reports and the session are stored locally with AsyncStorage
- Password hashing with expo-crypto
- Fonts: Fraunces, Instrument Sans and IBM Plex Mono

## How to install
Requires Node.js 22 (the version used to build this app).

```
git clone https://github.com/alainnjonyu626-cmd/personal-finance-tracker-Budi-Alain.git
cd personal-finance-tracker-Budi-Alain
npm install
```

The project includes a `.npmrc` file with `legacy-peer-deps=true`, so a plain `npm install` is enough.

## How to run
```
npx expo start --web
```

Open **http://localhost:8081** in a browser (use `localhost`: password hashing needs a secure browser origin, so opening the app through a network address may not work).

## Test login
All data is saved in the browser's local storage, so a new browser has no accounts yet. Register one first, then log in:

- Name: `Test User`
- Email: `test@example.com`
- Password: `test1234` (a throwaway password: never use a real one)

To try Forgot Password, use the email of an account you registered.

## Project structure
```
src/
  app/          screens (login, register, forgot-password, reset-password, reports, add-report, edit-report)
    components/   TextField, PasswordField, Button, Banner, Icon, AuthScreen, ReportForm
  context/      AuthContext (who is logged in)
  storage/      storage helpers, accounts service, reports service
  theme/        colours, fonts, spacing
  utils/        validation, money, dates, balance, crypto
  strings/      all app text
docs/           prompt log and reflection
```

## Prompt log and reflection
- Prompt log: [docs/PROMPT_LOG.md](docs/PROMPT_LOG.md)
- Reflection: [docs/REFLECTION.md](docs/REFLECTION.md)