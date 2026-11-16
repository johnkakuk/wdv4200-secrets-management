# WDV4200 Week 2: Secrets Management

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
