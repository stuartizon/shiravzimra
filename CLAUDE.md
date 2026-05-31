# Shira V'Zimra — Claude Code Rules

## Ticket workflow

This project is tracked on a monday.com board (board ID: `5097581269`).

When starting work on a ticket:
1. Move the item's Status to **In Progress** on the monday.com board.
2. Create a new git branch from the latest `master` — name it after a short descriptive slug, e.g. `alt-text-icons`.

## Testing

Follow red-green-refactor TDD:
1. Write the tests for the new functionality first — they must fail before any implementation begins.
2. Implement the functionality.
3. Work is only complete when all tests pass.

Never mark a task done or move it to In Review until the test suite is green.

When asked to create a PR:
1. Push the branch and open the PR against `master`.
2. Update the monday.com item's **PR Link** column (column ID: `link_mm3w3fym`) with the PR URL and a short label, e.g. `PR #3 alt-text-icons`.
3. Move the item's Status to **In Review**.
