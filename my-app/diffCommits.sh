git checkout $1;
firstCommit=$(git rev-parse HEAD);
node ../memory-tests/MemoryTest.js $firstCommit
git checkout $2;
secondCommit=$(git rev-parse HEAD);
node ../memory-tests/MemoryTest.js $secondCommit

hash1=$(echo $firstCommit | cut -c1-7)
hash2=$(echo $secondCommit | cut -c1-7)

cd ../memory-tests && python3 createGraphs.py $hash1 $hash2

open ../memory-tests/graphs/$hash1-$hash2
