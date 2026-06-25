#!/usr/bin/env bash
# verify-site.sh — re-runnable health check for optiscaleadvisors.com
# Exit non-zero if any check fails.

SITE_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FAIL=0

pass() { echo "PASS: $1"; }
fail() { echo "FAIL: $1"; FAIL=1; }

# ---------------------------------------------------------------------------
# CHECK 1: No file contains "cal.com/optiscale360"
# ---------------------------------------------------------------------------
HITS=$(grep -rl "cal\.com/optiscale360" "$SITE_ROOT" \
  --include="*.html" --include="*.txt" --include="*.xml" 2>/dev/null \
  | grep -v "node_modules" | grep -v "\.git")
if [ -z "$HITS" ]; then
  pass "No cal.com/optiscale360 links found"
else
  fail "cal.com/optiscale360 found in:"
  echo "$HITS"
fi

# ---------------------------------------------------------------------------
# CHECK 2: No public file contains "@optiscale360.com"
# ---------------------------------------------------------------------------
HITS=$(grep -rl "@optiscale360\.com" "$SITE_ROOT" \
  --include="*.html" --include="*.txt" --include="*.xml" 2>/dev/null \
  | grep -v "node_modules" | grep -v "\.git" | grep -v "studio")
if [ -z "$HITS" ]; then
  pass "No @optiscale360.com email addresses found"
else
  fail "@optiscale360.com found in:"
  echo "$HITS"
fi

# ---------------------------------------------------------------------------
# CHECK 3: No public .html contains "riskfreesites" or "OptiScale360" (case-insensitive)
# ---------------------------------------------------------------------------
HITS=$(grep -ril "riskfreesites\|optiscale360" "$SITE_ROOT" \
  --include="*.html" 2>/dev/null \
  | grep -v "node_modules" | grep -v "\.git" | grep -v "/components/" \
  | grep -v "/studio" | grep -v "admin" | grep -v "editor")
if [ -z "$HITS" ]; then
  pass "No riskfreesites or optiscale360 brand text in public HTML"
else
  fail "riskfreesites or optiscale360 found in public HTML:"
  echo "$HITS"
fi

# ---------------------------------------------------------------------------
# CHECK 4: No flat blog post files exist (blog/*.html except blog/index.html)
# ---------------------------------------------------------------------------
HITS=$(find "$SITE_ROOT/blog" -maxdepth 1 -name "*.html" ! -name "index.html" 2>/dev/null)
if [ -z "$HITS" ]; then
  pass "No flat blog/*.html files (all posts are folders)"
else
  fail "Flat blog HTML files found (should be folders):"
  echo "$HITS"
fi

# ---------------------------------------------------------------------------
# CHECK 5: Every <loc> in sitemap.xml resolves to a real file on disk
# ---------------------------------------------------------------------------
SITEMAP="$SITE_ROOT/sitemap.xml"
SITEMAP_FAIL=0
while IFS= read -r LOC; do
  # Strip domain, normalize to path
  PATH_PART="${LOC#https://optiscaleadvisors.com}"
  [ -z "$PATH_PART" ] && PATH_PART="/"

  # Try: exact file, .html file, folder/index.html, trailing-slash folder/index.html
  if [ "$PATH_PART" = "/" ]; then
    TARGET="$SITE_ROOT/index.html"
  elif [[ "$PATH_PART" == */ ]]; then
    # Trailing slash → folder/index.html
    TARGET="$SITE_ROOT${PATH_PART}index.html"
  else
    # Try .html first, then folder/index.html
    if [ -f "$SITE_ROOT${PATH_PART}.html" ]; then
      TARGET="$SITE_ROOT${PATH_PART}.html"
    elif [ -f "$SITE_ROOT${PATH_PART}/index.html" ]; then
      TARGET="$SITE_ROOT${PATH_PART}/index.html"
    elif [ -f "$SITE_ROOT${PATH_PART}" ]; then
      TARGET="$SITE_ROOT${PATH_PART}"
    else
      TARGET=""
    fi
  fi

  if [ -n "$TARGET" ] && [ -f "$TARGET" ]; then
    : # ok
  else
    echo "  MISSING: $LOC → $TARGET"
    SITEMAP_FAIL=1
    FAIL=1
  fi
done < <(grep -o '<loc>[^<]*</loc>' "$SITEMAP" | sed 's/<[^>]*>//g')

[ "$SITEMAP_FAIL" -eq 0 ] && pass "All sitemap.xml <loc> entries resolve to real files"

# ---------------------------------------------------------------------------
# CHECK 6: No _redirects source path has a matching file when target differs
#          from the clean-URL version of the source (orphan-file-overrides-redirect)
# Intentional patterns that are skipped:
#   /foo.html → /foo       (clean URL redirect — file exists to serve the page)
#   /foo/index.html → /foo/ (folder index clean URL)
# ---------------------------------------------------------------------------
REDIRECTS="$SITE_ROOT/_redirects"
ORPHAN_FAIL=0
while IFS= read -r LINE; do
  # Skip comments and blank lines
  [[ "$LINE" =~ ^# ]] && continue
  [ -z "$(echo "$LINE" | tr -d '[:space:]')" ] && continue

  SRC=$(echo "$LINE" | awk '{print $1}')
  DST=$(echo "$LINE" | awk '{print $2}')
  [ -z "$SRC" ] || [ -z "$DST" ] && continue

  # Skip intentional clean-URL redirects: /foo.html → /foo (or /foo/)
  CLEAN_SRC="${SRC%.html}"
  if [ "$DST" = "$CLEAN_SRC" ] || [ "$DST" = "${CLEAN_SRC}/" ]; then
    continue
  fi
  # Skip /foo/index.html → /foo/ patterns
  if [[ "$SRC" == */index.html ]]; then
    DIR_PATH="${SRC%index.html}"
    if [ "$DST" = "$DIR_PATH" ] || [ "$DST" = "${DIR_PATH%/}" ]; then
      continue
    fi
  fi

  # Now check if a file exists that would shadow this non-trivial redirect
  SHADOW=""
  if [ -f "$SITE_ROOT$SRC" ]; then
    SHADOW="$SITE_ROOT$SRC"
  fi

  if [ -n "$SHADOW" ]; then
    echo "  SHADOW: $SRC → $DST (file exists: $SHADOW — redirect will never fire)"
    ORPHAN_FAIL=1
    FAIL=1
  fi
done < "$REDIRECTS"

[ "$ORPHAN_FAIL" -eq 0 ] && pass "No orphan files shadowing _redirects rules"

# ---------------------------------------------------------------------------
# CHECK 7: Every blog folder's canonical ends with a trailing slash
# ---------------------------------------------------------------------------
CANONICAL_FAIL=0
for INDEX in "$SITE_ROOT"/blog/*/index.html; do
  [ -f "$INDEX" ] || continue
  CANONICAL=$(grep -o 'rel="canonical"[^>]*href="[^"]*"' "$INDEX" | grep -o 'href="[^"]*"' | tr -d 'href="')
  if [ -z "$CANONICAL" ]; then
    CANONICAL=$(grep -o "<link rel=['\"]canonical['\"][^>]*>" "$INDEX" | grep -o "href=['\"][^'\"]*['\"]" | sed "s/href=['\"]//;s/['\"]$//")
  fi
  if [ -n "$CANONICAL" ] && [[ "$CANONICAL" != */ ]]; then
    echo "  BAD CANONICAL (no trailing slash): $INDEX → $CANONICAL"
    CANONICAL_FAIL=1
    FAIL=1
  fi
done

[ "$CANONICAL_FAIL" -eq 0 ] && pass "All blog folder canonicals end with trailing slash"

# ---------------------------------------------------------------------------
echo ""
if [ "$FAIL" -eq 0 ]; then
  echo "ALL CHECKS PASSED"
else
  echo "SOME CHECKS FAILED — fix the issues above before committing"
  exit 1
fi
