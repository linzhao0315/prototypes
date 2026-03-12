#!/bin/bash
# Motion Skills Installer for Claude Code
# Usage: ./install.sh [target-project-path]
#   If no path given, installs to current directory's .claude/skills/

set -e

TARGET="${1:-.}"
SKILLS_DIR="$TARGET/.claude/skills"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🎬 Motion Skills Installer"
echo "=========================="
echo ""

# Check if target exists
if [ ! -d "$TARGET" ]; then
  echo "❌ Target directory not found: $TARGET"
  exit 1
fi

# Create skills directory
mkdir -p "$SKILLS_DIR/motion-design"
mkdir -p "$SKILLS_DIR/frontend-design"

# Copy skills
cp "$SCRIPT_DIR/skills/motion-design/SKILL.md" "$SKILLS_DIR/motion-design/SKILL.md"
cp "$SCRIPT_DIR/skills/frontend-design/SKILL.md" "$SKILLS_DIR/frontend-design/SKILL.md"

echo "✅ Installed to: $SKILLS_DIR"
echo ""
echo "   motion-design/SKILL.md    — 6 animation patterns + tokens"
echo "   frontend-design/SKILL.md  — High-end UI design system"
echo ""
echo "Done! Open Claude Code in '$TARGET' and ask it to animate something."
