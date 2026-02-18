#!/bin/sh
# Used as GIT_EDITOR during rebase to strip " for Elauwit" from commit messages.
sed -i '' 's/ for Elauwit//' "$1"
