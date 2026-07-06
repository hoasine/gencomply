# Contributing

Thank you for improving GenComply. These guidelines align with GenLayer program review expectations.

## Before you push

- [ ] No `frontend/.env`, `node_modules/`, or `.next/` in commits
- [ ] No files from other projects (GenRights, FootballBets, PatternTest, etc.)
- [ ] README and `docs/` are in **English**
- [ ] Contract changes include updates to `tests/direct/test_gencomply.py` when behavior changes

## Commit messages

Use clear, imperative subjects (present tense):

```
feat: add policy card grid on homepage
fix: clarify policy URL must match crawled content
docs: add English development guide
refactor: extract strict URL crawl helper in contract
test: cover work_type_match rejection on register
```

Avoid single large commits that mix unrelated changes. Prefer focused commits:

1. Contract / tests
2. Frontend feature
3. Documentation

## Branch workflow

```bash
git checkout -b feat/short-description
# make changes
git add <files>
git commit -m "feat: describe the change"
git push -u origin feat/short-description
```

Open a pull request against `master`.

## Contract conventions

- Wrap `gl.nondet.web.render` in `gl.eq_principle.strict_eq` via `_crawl_url_strict()` — avoid loop-closure `def fetch(u=url)` helpers
- Registration validators must check `valid`, `work_type_match`, `fingerprint_summary`, and `confidence_percent`
- Do not call nondeterministic operations outside equivalence-principle blocks

## Questions

Open an issue on [github.com/hoasine/gencomply](https://github.com/hoasine/gencomply).
