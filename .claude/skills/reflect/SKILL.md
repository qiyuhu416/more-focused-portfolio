---
description: End-of-session learning reflection. Reads the question log and project memory, summarizes what was explored, then quizzes you one question at a time to test your understanding. Call this when you're done building and want to solidify what you learned.
---

# /reflect

When this skill is invoked, follow these steps exactly.

## 1. Read the log

Read `.claude/learning-log.md`. If it's empty or missing, say so and stop.

Also read the project memory files for context on decisions made.

## 2. Find the learning moments

From the log, pick out messages that are conceptual — questions about *why* or *how* something works, moments of confusion, requests for explanation. Skip pure commands ("commit", "build it", "make the button red").

Look for patterns like:
- "why does X..."
- "what's the difference..."
- "explain... in simple terms"
- "i don't understand"
- "how does X work"
- "is that about..."

## 3. Summarize briefly

Tell the user the 3–5 concepts that came up. Just name them — don't explain yet. One sentence each.

Example:
> "Today you ran into 4 things worth testing:
> - Why animating `width` is slow vs `transform`
> - How scroll links directly to DOM style without React
> - The difference between hooks and skills
> - What `requestAnimationFrame` actually does"

## 4. Quiz — one question at a time

For each concept:

1. Ask a single clear question in plain language. Not a copy from the conversation — rephrase it.
2. **Stop. Wait for their answer. Do not continue.**
3. Read what they wrote. Be honest:
   - If the answer is right: say so briefly, note anything they missed, move on.
   - If it's vague or wrong: give a clear short explanation, then ask a simpler follow-up to confirm they got it.
4. Move to the next concept.

Keep questions conversational. Examples:
- "So in your own words — why did we stop using `width` for the animation?"
- "What's the job of `requestAnimationFrame`? What would break without it?"
- "You asked if this was a React problem — was it? What made it not a React problem?"
- "What's the one-sentence difference between a hook and a skill?"

## 5. Close

After all questions, give an honest 2–3 sentence wrap-up: what they understood well, what was shaky. If anything was unclear, suggest one concrete thing to look up or try.

## Rules

- One question at a time. Always.
- Don't give the answer before they try.
- Don't say "great job!" when the answer was vague.
- Short responses throughout — this is a conversation, not a lecture.
- Tone: like a good study partner, not a teacher grading a test.
