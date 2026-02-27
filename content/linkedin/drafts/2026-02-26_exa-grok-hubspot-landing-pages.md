> **Platform**: LinkedIn
> **Pillar**: GTM Workflow / Building & Sharing
> **Date**: 2026-02-26
> **Status**: draft

---

## Post

I stopped building landing pages by hand.

not because I got lazy. because I realized I was doing the same thing 30 times:

1. research a company
2. figure out what they care about
3. write copy that speaks to their pain
4. format it as a landing page
5. upload it to the CMS
6. repeat for the next account

so I automated the whole pipeline. end to end. CLI only. never touch the CMS.

here's the stack:

**Exa MCP** - pulls real-time company intelligence. firmographics, tech stack, recent news, hiring signals. not scraped garbage - structured data I can actually use in a prompt.

**Python SDK** - orchestrates the whole flow. takes the Exa research output, formats the context, sends it to the model, handles the templating.

**Grok** - generates the landing page copy. headline, subhead, pain points, value props, CTA. all personalized to the account based on what Exa found.

**HubSpot CLI** - pushes the finished page directly to HubSpot. no browser. no drag-and-drop editor. no waiting for the CMS to load. one command and it's live.

the whole thing runs from a terminal. I type one command, pass in a company name, and 90 seconds later there's a personalized landing page sitting in HubSpot ready to be linked in an outbound sequence.

what used to take me 45 minutes per page now takes under 2 minutes. and the quality is better because Exa's research layer means every page references real things about the company - not generic "we help businesses like yours" copy.

the trick isn't any single tool. it's wiring them together so the output of one feeds the input of the next. MCP for research. SDK for orchestration. model for generation. CLI for deployment. no GUI in the loop.

if you're still building landing pages one at a time in a CMS editor, you're spending hours on something that should be a script.

shawn - the gtme alchemist

---

## Comment 1 (pin immediately)

the flow in plain terms:

terminal command → Exa researches the company → Python formats the brief → Grok writes the page → HubSpot CLI publishes it

no tabs. no CMS. no copy-pasting between tools. one pipeline.

---

## Comment 2

for people asking "what about design/templates":

I have 3 HubSpot templates pre-built. the script picks the right one based on the use case and fills in the dynamic content. design is solved once. copy is solved every time by the pipeline.

---

## Comment 3

the part people miss about MCP servers:

Exa isn't just "another API." it's a tool the AI model can call natively inside the workflow. the model decides what to research, how deep to go, and what data matters. I'm not writing API calls - the model is using the tool.

that's the difference between "AI automation" and actually letting agents use tools.

---
