rm -rf ./output
rm -rf ./src/common/dict
node backend/makeDict.js
cp -R ./output ./src/common/dict
