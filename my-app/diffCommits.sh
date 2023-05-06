#!/bin/bash
git checkout $1;
sleep 10
firstCommit=$(git rev-parse HEAD)
node ../mock-backend/index.js &
  BACKEND_PID=$! &&
yarn build 
serve -s build &
  SERVE_PID=$! &&
echo "sleeping"
sleep 10
echo "starting first memory test"
node ../memory-tests/MemoryTest.js $firstCommit
echo " kill $SERVE_PID $(kill $SERVE_PID)"
echo " kill $BACKEND_PID $(kill $BACKEND_PID)"
sleep 10
git checkout $2;
secondCommit=$(git rev-parse HEAD)
node ../mock-backend/index.js &
  BACKEND_PID=$! &&
yarn build 
serve -s build &
  SERVE_PID=$! &&
echo "sleeping"
sleep 10
echo "starting second memory test "
node ../memory-tests/MemoryTest.js $secondCommit
echo " kill $SERVE_PID $(kill $SERVE_PID)"
echo " kill $BACKEND_PID $(kill $BACKEND_PID)"
cd ../memory-tests && python3 createGraphs.py $firstCommit $secondCommit