# Pull Request Workflow

This document explains how contributors submit code changes and how reviewers approve and merge them.

## Why pull requests?

Every push to `main` deploys directly to production via Vercel. Direct pushes to `main` bypass code quality checks and ship untested code immediately. With pull requests, changes are reviewed before anything reaches production.

## One issue, one PR

Each pull request should address a single concern. This keeps reviews focused, history clean, and makes it easy to roll back a specific change if needed.

**Good — one issue per PR:**

| Issue | Branch | PR title |
|---|---|---|
| #18 Double scrollbar | `fix/double-scrollbar` | `fix(layout): replace overflow-x-hidden with overflow-x-clip` |
| #5 Toaster not mounted | `fix/toaster-missing` | `fix(widget): mount Toaster in root layout` |

**Avoid — multiple unrelated concerns in one PR:**

> Scrollbar fix + favicon + lazy loading all in one PR

If you are working on something and notice an unrelated bug, resist the urge to fix it in the same branch. Open a separate issue and fix it in its own PR.

**Always reference the issue in the PR body:**

```
Closes #18
```

This automatically closes the issue when the PR is merged.

---

## Contributor — Submitting a pull request

### Step 1 — Never work directly on main

`main` is protected — it deploys to production on every merge. Always branch off it:

```bash
git checkout main
git pull origin main
git checkout -b feat/your-feature-name
```

Use branch names that match what you are building, for example:

```
feat/auth-supabase
fix/double-scrollbar
fix/footer-links-swapped
perf/lazy-load-svgs
```

### Step 2 — Make your changes and commit

Follow the commit convention (see [commits-conventions.md](./commits-conventions.md)):

```bash
git add src/routes/ca.tsx src/routes/us.tsx
git commit -m "fix(layout): replace overflow-x-hidden with overflow-x-clip on main"
```

### Step 3 — Push your branch

```bash
git push origin feat/your-feature-name
```

### Step 4 — Open a pull request

```bash
gh pr create \
  --title "fix(layout): replace overflow-x-hidden with overflow-x-clip" \
  --body "Fixes double scrollbar on /ca and /us caused by overflow-x-hidden forcing overflow-y: auto on <main>. Closes #18" \
  --base main
```

Or open it in the browser — GitHub will prompt you after pushing.

### Step 5 — Wait for CI

The CI pipeline runs automatically. Check its status:

```bash
gh pr checks
```

If CI fails, read the output:

```bash
gh run list --limit 3
gh run view <run-id> --log-failed
```

### Step 6 — Fix CI failures and update the PR

Fix the issues, then push again to the same branch — the PR updates automatically:

```bash
git add src/routes/ca.tsx
git commit -m "fix(layout): also apply overflow fix to us route"
git push origin feat/your-feature-name
```

CI will re-run. Repeat until green.

### Step 7 — Request review

Once CI is green, assign a reviewer or post in the team channel that the PR is ready.

---

## Reviewer — Reviewing and approving a pull request

**See open pull requests:**

```bash
gh pr list --repo dev-one-dev/figma-craft-39
```

**Review a specific PR:**

```bash
gh pr view <pr-number> --repo dev-one-dev/figma-craft-39
```

**Check CI status on the PR:**

```bash
gh pr checks <pr-number> --repo dev-one-dev/figma-craft-39
```

**Approve and merge (only after CI is green):**

```bash
gh pr review <pr-number> --approve --repo dev-one-dev/figma-craft-39
gh pr merge <pr-number> --squash --repo dev-one-dev/figma-craft-39
```

`--squash` combines all commits in the PR into one clean commit on `main`.

**Request changes:**

```bash
gh pr review <pr-number> --request-changes --body "Your feedback here." --repo dev-one-dev/figma-craft-39
```
