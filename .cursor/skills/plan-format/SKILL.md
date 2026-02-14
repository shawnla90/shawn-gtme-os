---
name: plan-format
description: Produces structured plans with model recommendations, execution order, parallel/sequential grouping, and direct task instructions. Use when creating plans in plan mode, building from plans, or when the user asks for a structured plan, execution order, or model recommendations for tasks.
---

# Structured Plan Format

When creating plans (in plan mode or when building/planning), always use this format. Every plan must include model/agent recommendations, execution order, parallel vs sequential grouping, and direct instructions right where each agent is selected.

## Required Sections

### 1. Overview (YAML frontmatter)

```yaml
---
name: <Plan Name>
overview: <One-line summary>
todos:
  - id: <id>
    content: <Task summary>
    status: pending
isProject: true/false
---
```

### 1b. Populate Cursor's Todo UI (required)

**Immediately after** writing the plan (with YAML todos), call the **TodoWrite** tool so the user can stay in the plan and navigate agents without tab-hopping.

- `todos`: The same list as in YAML — `{ id, content, status: "pending" }` per task
- `merge: false` — replace any existing todos with this plan's tasks

This makes todos visible in Cursor's todo panel for selection, parallel execution, and order tracking. The user needs to see the list in the plan context so they know which order to run tasks and can pick agents from there.

### 2. Task Assignments — Grouped by Parallel vs Sequential

Structure tasks into **tracks**:

- **TRACK A (parallel):** Tasks that can run simultaneously in separate agent windows
- **TRACK B (sequential):** Tasks that depend on earlier work — list dependency explicitly

Each task block must include **both** in one place:

1. **What to do** — Direct, copy-paste-ready instructions (file paths, exact steps, code snippets)
2. **Agent recommendation:** — Which model to use and why (e.g., "Standard Cursor Agent (Sonnet)", "Fast model")

Keep instructions and recommendation together so when the user selects an agent for that task, they see everything in one block.

**Template per task:**

```markdown
#### <ID>. <Task Title>

**File:** [path/to/file](path/to/file)

**What to do:**

- Bullet or numbered steps
- Exact commands, keys, or code to add
- Graceful fallbacks if applicable

**Agent recommendation:** <Model> — <One-sentence rationale>
```

### 3. Execution Order Summary

Include an ASCII diagram showing timeline and dependencies:

```
Time ──────────────────────────────────────────────────>

Track A (parallel):
  [A1: task name] ──────────>
  [A2: task name] ────>

Track B (sequential, after A1):
                                [B1: task name] ──>
                                [B2: task name] ──>
                                               [B3: task name] ──>
```

Then a one-paragraph summary: *"You can run A1 and A2 simultaneously in separate agent windows. Once A1 lands, B1 and B2 run sequentially because…"*

### 4. Model/Agent Recommendations Summary Table

| Task | Complexity | Recommended Model | Why |
|------|------------|-------------------|-----|
| A1: short name | Low/Medium/High | Sonnet / Fast / etc. | Brief rationale |
| A2: … | … | … | … |

Add guidance when useful: *"You do NOT need <X> for any of these. The largest file is Y lines."*

## Principles

- **Always call TodoWrite** — YAML frontmatter is the source of truth; TodoWrite syncs it to Cursor's UI. Without it, the todo panel stays empty and the user can't select tasks, see order, or run in parallel from the plan.
- **Direct instructions at selection point** — Never separate "what to do" from "which agent to use." The user should open a task block and have everything needed to hand off or execute.
- **Explicit parallel vs sequential** — Always state what can run in parallel and what must wait. No implicit ordering.
- **Model recommendation per task** — Every task gets a specific model suggestion (Sonnet, Fast, etc.) with rationale. Avoid over-prescribing expensive models when a fast one suffices.
- **Copy-paste ready** — File paths, commands, and key snippets should be literal so an agent can act without guessing.

## Trigger Terms

Use this format when: "plan mode", "create a plan", "build from plan", "execution order", "parallel tasks", "model recommendation", "which agent", "structured plan", "breakdown with agents".
