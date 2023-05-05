#!/bin/bash

git checkout $1;
firstCommit=$(git rev-parse HEAD);
node ../memory-tests/MemoryTest.js $firstCommit
git checkout $2;
secondCommit=$(git rev-parse HEAD);
node ../memory-tests/MemoryTest.js $secondCommit

cd ../memory-tests && python3 createGraphs.py $firstCommit $secondCommit