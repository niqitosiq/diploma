#!/bin/bash

git checkout $1;
firstCommit=$(git rev-parse HEAD);
node ../memory-tests/MemoryTest.js $firstCommit
git checkout $2;
secondCommit=$(git rev-parse HEAD);
node ../memory-tests/MemoryTest.js $secondCommit

cd ../memory-tests && python3 createGraphs.py $firstCommit $secondCommit
yarn diffCommits 3482e4b75a9a78b92092cfc2126ea77f306b7c81 6c744c0c92c967a16f3dc03698c7d712f4d53f69