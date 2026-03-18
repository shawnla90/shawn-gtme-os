# Superpowers - On-Demand Methodology Framework

> Adapted from [obra/superpowers](https://github.com/obra/superpowers) (95k stars, MIT).
> Invoke with `/superpowers` or when you want disciplined, systematic execution on a project.

## When to Use

Invoke this skill when:
- Starting a non-trivial optimization, refactor, or build session
- You want systematic brainstorming before implementation
- Debugging something that resists quick fixes
- You need verification gates to prevent shipping broken work
- The user says "use superpowers" or "/superpowers"

## Core Principles

1. **Brainstorm before building** - explore intent, propose 2-3 approaches, get approval
2. **Plan before coding** - bite-sized steps (2-5 min each) with exact file paths
3. **Evidence before claims** - run verification commands, read output, THEN claim success
4. **Root cause before fixes** - no fixes without investigation (Phase 1-4 debugging)
5. **One change at a time** - test each change independently

## The Workflow

```
BRAINSTORM -> PLAN -> EXECUTE -> VERIFY -> SHIP
```

### 1. Brainstorm Phase

Before any implementation:
- Explore current project state (files, docs, recent commits)
- Ask clarifying questions ONE AT A TIME
- Propose 2-3 approaches with trade-offs and your recommendation
- Get user approval on the design before proceeding
- HARD GATE: no code until design is approved

### 2. Planning Phase

Write implementation plan with:
- **File structure** - which files will be created or modified
- **Bite-sized tasks** - each step is one action (2-5 minutes)
- **Exact file paths** - no ambiguity
- **Verification commands** - how to prove each step worked
- **Commit points** - frequent, atomic commits

Task format:
```
### Task N: [Component Name]
Files: create/modify/test paths
- [ ] Step 1: Write the failing test / make the change
- [ ] Step 2: Run verification
- [ ] Step 3: Confirm result
- [ ] Step 4: Commit
```

### 3. Execution Phase

For each task:
1. Follow plan steps exactly
2. Run verifications as specified
3. Stop and ask if blocked - don't guess
4. Commit after each logical unit

### 4. Verification Phase (The Iron Law)

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

Before claiming anything works:
1. IDENTIFY: What command proves this claim?
2. RUN: Execute the FULL command (fresh)
3. READ: Full output, check exit code
4. VERIFY: Does output confirm the claim?
5. ONLY THEN: Make the claim

Red flags - STOP if you catch yourself:
- Using "should", "probably", "seems to"
- Expressing satisfaction before verification
- Trusting previous runs instead of fresh evidence
- Committing without running the build

### 5. Systematic Debugging

When encountering bugs (the Four Phases):

**Phase 1: Root Cause Investigation** (REQUIRED before any fix)
- Read error messages carefully and completely
- Reproduce consistently
- Check recent changes (git diff)
- Trace data flow to find the source

**Phase 2: Pattern Analysis**
- Find working examples in the codebase
- Compare working vs broken
- Identify every difference

**Phase 3: Hypothesis Testing**
- Form single hypothesis: "X is the root cause because Y"
- Make the SMALLEST possible change to test
- One variable at a time

**Phase 4: Implementation**
- Fix the root cause, not the symptom
- Create failing test case first
- Verify fix, check no regressions
- If 3+ fixes failed: question the architecture, don't keep patching

## Anti-Patterns to Reject

| Thought | Reality |
|---------|---------|
| "This is too simple for a plan" | Simple tasks benefit most from discipline |
| "Let me just try this quick fix" | Quick fixes create new bugs |
| "Should work now" | RUN the verification |
| "I'm confident" | Confidence is not evidence |
| "Multiple fixes at once saves time" | Can't isolate what worked |
| "I'll write tests after" | Untested fixes don't stick |

## Integration with ShawnOS Workflow

This skill complements existing CLAUDE.md rules:
- Plan Mode Default -> enhanced with superpowers brainstorming
- Verification Before Done -> strengthened with Iron Law
- Autonomous Bug Fixing -> guided by systematic debugging phases
- Demand Elegance -> informed by 2-3 approach comparison

When superpowers is active, it ADDS discipline on top of existing rules, never removes them.
