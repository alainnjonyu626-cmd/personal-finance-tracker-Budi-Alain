# Reflection

## My hardest problem
The hardest problem was not a single bug but keeping the project under control while using AI tools. Setting up the project was difficult: the folder name had a space, my npm version was too old, and my internet kept dropping, which left half-installed packages. I also ran out of free AI credits three times and had to move between tools (Claude, then DeepSeek, then GitHub Copilot). Some tools did things I had forbidden, such as running lint and installing packages, or writing a setting into my VS Code files.

## How I solved it
I cleaned up after each failed install and retried in small steps. I wrote strict rules into a prompt header file that I attached to every prompt, and I gave each prompt a short list of exact files to attach and a list of the only files it could change. I never trusted the AI's own report: after every prompt I ran `git status` to see which files really changed, `npx tsc --noEmit` to catch type errors, and I tested the app in the browser. This caught real problems, for example two type errors in the Edit screen that the AI did not notice, and a summary that gave two different expense totals. I tested the balance with the example transactions from the brief and it showed exactly 102,300 FCFA.

## What I would improve
- Limit the number of wrong reset-code attempts, because right now someone could keep guessing the 6-digit code.
- Use a slow password hash such as bcrypt or Argon2 on a real server, instead of salted SHA-256 on the device.
- Also check the maximum amount inside the reports service, not only in the form.
- Add a real date picker instead of typing the date as YYYY-MM-DD.
- Add the bonus features I did not have time for: delete with confirmation, search and filter, a monthly chart and CSV or PDF export.
- Add automatic tests, so I do not have to test everything by hand.