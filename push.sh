#!/usr/bin/env bash
remote_repo=https://github.com/dimaslanjaka/nodejs-package-types.git
INPUT_BRANCH=through2
git push "${remote_repo}" HEAD:${INPUT_BRANCH} --follow-tags;
git subtree push -m 'update' --rejoin --prefix through2 origin through2
git subtree push --prefix=through2 https://github.com/dimaslanjaka/nodejs-package-types.git through2