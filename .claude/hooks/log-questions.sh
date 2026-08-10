#!/bin/bash
# Runs on every UserPromptSubmit.
# Reads the user's message from stdin (JSON), appends it to learning-log.md.

INPUT=$(cat)

# Extract prompt text from JSON
PROMPT=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    text = data.get('prompt', data.get('message', data.get('content', ''))).strip()
    print(text)
except:
    pass
" 2>/dev/null)

# Nothing to log
[ -z "$PROMPT" ] && exit 0

# Skip slash-command invocations (skills like /reflect, /run, etc.)
[[ "$PROMPT" == /* ]] && exit 0

LOG=".claude/learning-log.md"

# Create file with header if it doesn't exist
if [ ! -f "$LOG" ]; then
  printf "# Learning Log\n\nAuto-captured questions and messages, newest at the bottom.\n\n" > "$LOG"
fi

# Append entry: timestamp + message
printf "**%s**\n%s\n\n---\n\n" "$(date '+%Y-%m-%d %H:%M')" "$PROMPT" >> "$LOG"

exit 0
