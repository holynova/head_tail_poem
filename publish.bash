
start=$(date +%s)

rm -rf docs/  
mkdir docs 
pnpm run build:pages
cp -R dist/* docs 
git add . 
git commit -m 'rebuild to publish' 
git push
echo '完成编译和发布'

end=$(date +%s)
take=$(( end - start ))
echo 完成编译和发布, 耗时 ${take} 秒.
