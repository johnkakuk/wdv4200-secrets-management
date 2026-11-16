# WDV4200 Week 2: Secrets Management

> **You are on branch `3-non-shared-env`: secrets are loaded from a `.env` file that is NOT committed.**
>
> This branch has no hard-coded secrets and no secrets file. The app still reads its secrets from `.env` using [dotenv](https://www.npmjs.com/package/dotenv), but `.env` is listed in [`.gitignore`](.gitignore), so git never tracks it. **If you clone this branch and run it as-is, it stops with an error** because there is no `.env` file:
>
> ```
> ERROR: No .env file found. This app needs a .env file with its secrets.
> Copy .env.example to .env and fill in the values. See README.md.
> ```
>
> This branch was also created from `main`, not from `2-shared-env`, so the commit that added a `.env` file is not in its history.

## Required secrets

Create a `.env` file in the project root with these six values. [`.env.example`](.env.example) is a blank template you can copy (`cp .env.example .env`). Any values will work for this demo app. In a real app, they'd come from your team's secrets manager or a teammate over a secure channel, never from the repository.

| Variable | Used by | Purpose |
| --- | --- | --- |
| `API_KEY` | `/api/data` | Key clients must send as `?key=...` to get data |
| `DB_USER` | `/db` | Database username |
| `DB_PASSWORD` | `/db` | Database password (masked in the response) |
| `DB_HOST` | `/db` | Database server hostname |
| `DB_NAME` | `/db` | Database name |
| `JWT_SECRET` | `/token` | Secret used to sign tokens with HMAC-SHA256 |

Example `.env` (made-up values):

```
API_KEY=my-local-api-key
DB_USER=local_user
DB_PASSWORD=local-password
DB_HOST=localhost
DB_NAME=inventory
JWT_SECRET=some-long-random-string
```

If any value is missing or blank, the app names the missing ones and exits.

| Route | Secret used | What it does |
| --- | --- | --- |
| `/api/data?key=<your API_KEY>` | `API_KEY` | Returns data only if the key matches (otherwise 401) |
| `/db` | `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_NAME` | Builds a mock Postgres connection string and shows it with the password masked |
| `/token?user=john` | `JWT_SECRET` | Signs a simple HMAC-SHA256 token |

## Why the "." in front of `.env`?

On macOS and Linux, a file whose name starts with a dot is a hidden file ("dotfile"). `ls` and Finder don't show it unless you ask (`ls -a`, or Cmd+Shift+. in Finder). By convention, the dot marks configuration files that belong to the environment rather than the app's code, like `.gitignore`, `.bashrc` and `.npmrc`. That keeps a project's local settings out of sight in everyday use, so they're less likely to be opened, screenshotted or copied by accident.

The dot is **not** a security feature. A hidden file is still a plain-text file that anyone with access to the folder can read, and git will commit it like any other file (as branch `2-shared-env` shows). What keeps `.env` out of this repository is the `.env` line in `.gitignore`, not the dot.

## About this repository

A small Node/Express app, based on this week's example, that shows three ways of handling application secrets. All secrets in this repository are fake values made up for this assignment.

## One repository, three branches

The assignment asks for three separate repositories. This project uses **one repository with one branch per approach** instead:

| Branch | Approach |
| --- | --- |
| `main` | Shared base app with no secrets |
| `1-hardcoded` | Secrets hard-coded in the source code |
| `2-shared-env` | Secrets in a `.env` file committed to the repository |
| `3-non-shared-env` | Secrets loaded from a `.env` file that is **not** committed |

**Why one repo:** All three parts are the same app with one thing changed: where the secrets come from. Branches keep that shared code in one place, and `git diff 1-hardcoded 2-shared-env` shows exactly what changed between approaches. Three repos would copy the same boilerplate three times and give a reviewer three links where one will do.

One trade-off fits the lesson: the fake secrets committed on branches 1 and 2 can be read by anyone who clones the repo, whichever branch they check out. Once a secret is pushed to any branch, it is part of the repository's history.

## Running a branch

```bash
git clone -b <branch-name> <repo-url>
cd <repo-folder>
npm install
npm start
```

Then open http://localhost:3000. Each branch's README covers what that approach needs.
