#!/bin/bash

apiDir="$(pwd)"
ghPagesDir="/tmp/gh-pages"

rm -rf $ghPagesDir
mkdir $ghPagesDir
cd $ghPagesDir
git clone -b gh-pages https://github.com/bhovhannes/attask-api.git $ghPagesDir
cd $apiDir
node ./node_modules/gulp/bin/gulp.js docs
cd $ghPagesDir
rm -rf ./*
cp -r $apiDir/docs/* .
git add .
git commit -a -m "updated api docs"
git push origin gh-pages
cd $apiDir
rm -rf $ghPagesDir
