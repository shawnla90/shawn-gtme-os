# Prompt Formatting Standard

## When This Applies

Any time creating prompts for Clay, enrichment, qualification, or AI-powered workflow steps — whether in `prompts/` files, workflow skills, or inline prompt generation.

## Rules

### 1. Inputs Always at the Bottom

Never place input variables/placeholders at the top of a prompt. Structure is always:

1. **Role / context** — who the AI is, what it's evaluating
2. **Criteria / instructions** — the rules, scoring logic, qualification gates
3. **Output format** — what to return (always JSON array)
4. **Inputs** — the actual data to evaluate (at the very bottom)

### 2. Always Instruct JSON Array Output

Every prompt must instruct the model to return a JSON array. Format:

```
Return a JSON array with the following fields:
[{"field_name": "value", "field_name_2": "value"}]
```

Even for single-result prompts, use an array (Clay expects this).

### 3. Template

```
You are [role]. [Context about what you're evaluating].

## Criteria
[Numbered or bulleted qualification/evaluation criteria]

## Scoring (if applicable)
[Point system or decision logic]

## Output
Return a JSON array with the following fields:
[{"result": "QUALIFIED|NOT_QUALIFIED|NEEDS_RESEARCH", "score": 0, "reasoning": "...", "next_step": "..."}]

## Input
- Company name: {company_name}
- Domain: {domain}
- [other fields]
```

### 4. Do NOT

- Do not put `{input_field}` placeholders at the top of the prompt
- Do not return plain text — always JSON array
- Do not mix input data with instructions
