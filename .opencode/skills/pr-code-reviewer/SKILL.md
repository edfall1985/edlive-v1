---
name: pr-code-reviewer
description: "Comprehensive code review with 4 parallel subagents, smart tracing, and iterative refinement. Reviews logic, security, performance, and quality."
compatibility: opencode
metadata:
  author: Sisyphus (kokorolx/create-code-reviewer)
  version: "2.0.0"
  severity-levels: ["critical", "warning", "suggestion", "praise"]
---

# PR Code Reviewer

## Overview
Comprehensive PR reviewer that gathers full context, applies smart tracing based on change type, runs four specialized subagents in parallel, and iteratively refines findings into a final report.

## Workflow (CRITICAL - Follow Exactly)

### Phase 1: Context Gathering
1. Get PR metadata (title, description, author, base branch)
2. Get list of changed files with diff
3. Classify change type for each file:
   - LOGIC: Conditionals, business rules, state changes -> DEEP TRACE
   - STYLE: Formatting, naming, comments -> SHALLOW TRACE
   - REFACTOR: Structure changes without logic change -> MEDIUM TRACE
   - NEW: New files -> FULL REVIEW
4. Gather full context for each changed file:
   - Related callers/callees
   - Tests covering the change
   - Types/interfaces touched
   - Usage sites (callers and public API entry points)

### Phase 2: Smart Tracing (Based on Change Type)

#### For LOGIC changes (e.g., if-else condition changed):
1. Find ALL callers of the modified function (use LSP find_references)
2. Find ALL callees (functions called by modified code)
3. Find ALL tests that cover this code path
4. Find ALL types/interfaces affected
5. Trace data flow: where does input come from? where does output go?

#### For STYLE changes:
1. Check consistency with project conventions
2. Verify no accidental logic changes hidden in style changes

#### For REFACTOR changes:
1. Verify behavior preservation
2. Check all usages still work

### Phase 3: Parallel Subagent Execution

Launch ALL 4 subagents simultaneously with run_in_background: true:

Subagent 1: EXPLORE - Code Quality & Patterns
- Code style consistency
- Naming conventions
- Error handling patterns
- Type safety
- Code duplication
- Complexity (deep nesting, long functions)

Subagent 2: ORACLE - Security & Logic
- OWASP Top 10 vulnerabilities
- Logic correctness
- Edge cases and boundary conditions
- Race conditions and state management
- Input validation
- Authentication/authorization

Subagent 3: LIBRARIAN - Documentation & Best Practices
- Complex algorithms documented?
- Public APIs documented (JSDoc/TypeDoc)?
- Non-obvious decisions explained?
- Framework best practices followed?
- Anti-patterns from official docs?

Subagent 4: GENERAL - Tests & Integration
- New code paths tested?
- Edge cases covered?
- Existing tests still valid?
- Integration points - do changes break contracts?
- Performance implications

### Phase 4: Iterative Refinement
1. First Pass Synthesis - Merge, deduplicate, categorize
2. Gap Analysis - Incomplete results, untested paths, unreviewed files
3. Second Pass (if gaps found) - Targeted follow-up queries
4. Final Report Generation

### Phase 5: Report Generation

Save to `~/pr-reviews/{owner}_{repo}_PR{number}_{timestamp}.md`

## Configuration

Check for config at `.opencode/code-reviewer.json`.

## Usage Examples

```
/review PR#123
/review https://github.com/owner/repo/pull/123
/review --staged  (review staged changes locally)
```
