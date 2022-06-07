#!/bin/sh

rootDir=`pwd`
projectName=H5CommonFrameworkDemo

localDir=${rootDir}/$projectName/build/web-mobile/
gameName=`cat ${rootDir}/$projectName/gameinfo.json |jq -r '.zipName'`
android_version=`cat ${rootDir}/$projectName/gameinfo.json |jq -r '.version'`
uploadFileNamePath=`cat ${rootDir}/$projectName/gameinfo.json |jq -r '.scheme'`
dlcName=`cat ${rootDir}/$projectName/gameinfo.json |jq -r '.dlc'`
gameinfo=`cat ${rootDir}/$projectName/gameinfo.json`

if [ ! -d "BuildTools/node_modules" ]
then
cd BuildTools
npm install
cd $rootDir
fi

debugServerRoot=ubuntu@res.starcdn.cn:/data/www/html/h5games_debug/

#0.DEBUG 1.RELEASE
if [ $1 == 0 ]
then
#android_version=0.0.1
#ios_version=1.0.0
serverRoot=ubuntu@res.starcdn.cn:/data/www/html/h5games_debug/
serverPath=ubuntu@res.starcdn.cn:/data/www/html/h5games_debug/$uploadFileNamePath
gameList=https://res.starcdn.cn/h5games_debug/config/gamelist.json
remoteUrl=https://res.starcdn.cn/h5games_debug/
else
#android_version=1.0.0
serverRoot=ubuntu@res.starcdn.cn:/data/www/html/h5games_release/
serverPath=ubuntu@res.starcdn.cn:/data/www/html/h5games_release/$uploadFileNamePath
gameList=https://res.starcdn.cn/h5games_release/config/gamelist.json
remoteUrl=https://res.starcdn.cn/h5games_release/
fi

cd $rootDir

echo DLC Begin =====================

rm -rf $uploadFileNamePath
mkdir $uploadFileNamePath
folder_version=${android_version//./_}
path_version=${uploadFileNamePath}/${folder_version}
mkdir $path_version
dlcPath=${path_version}/dlc
mkdir ${dlcPath}

cd ${projectName}/build/web-mobile/assets/
dlcVersionFileName=`find ./${dlcName} -iname "config.*.json" -maxdepth 1`
dlcVersion=${dlcVersionFileName:(-10):5}

dlcZipName=${dlcName}.${dlcVersion}.zip
zip ${dlcZipName} ${dlcName}
rm -rf ${dlcName}
mv ${dlcZipName} ${rootDir}/${dlcPath}

echo DLC End =====================

cd $rootDir

echo Postprocessing Begin ==================================


#压缩图片
#echo waiting pngquant ...
#find $localDir -name '*.png' -exec pngquant/pngquant --ext .png --speed 1 --force 256 {} \;

#上传资源
#echo waiting sync ...
#sh ./delete_then_sync_to_debug_res_server.sh $localDir $1/android/$android_version
#sh ./delete_then_sync_to_debug_res_server.sh $localDir $1/iphone/$ios_version

#上传version文件
#info=$(cat Version.txt)
#info=${info/@APP/$app_version}
#version=Version.$app_version.txt
#echo ${info/@RES/$android_version} > $version
#sh ./sync_to_debug_res_server.sh $version $1/android
#echo ${info/@RES/$ios_version} > $version
#sh ./sync_to_debug_res_server.sh $version $1/iphone
#rm $version


#上传zip
#temp_dir=$gameName"_"$android_version
#zip_file=$gameName"_"$android_version.zip

temp_dir=$android_version
zip_file=$android_version.zip
zip_file_fullName=$gameName"_"$android_version.zip

mkdir ${temp_dir}

cp -r $localDir $temp_dir

zip -q -r $zip_file $temp_dir

echo old upload Start ====================================
scp $zip_file $serverPath"/"$zip_file_fullName
echo old upload Finished ====================================

cp $zip_file $path_version/$gameName".zip"

echo new upload Start ====================================
scp -r $uploadFileNamePath $serverRoot
echo new upload Finished ====================================

#scp ../$projectName/gameinfo.json $serverPath"/gameinfo.json"

#下载gamelist.json
curl ${gameList} -o ${temp_dir}/gamelistD.json

gameInfoPath=${rootDir}"/"${projectName}/gameinfo.json
gameListPath=${rootDir}"/BuildTools/"${temp_dir}/gamelistD.json

node gameListTools.js  ${gameInfoPath} ${gameListPath} ${rootDir}"/BuildTools/gamelist.json" $zip_file


scp ${rootDir}"/BuildTools/gamelist.json" ${debugServerRoot}config/

cp ${gameInfoPath} ./

# zip -q -r $gameName".zip" $zip_file gameinfo.json
cp $zip_file $gameName".zip"

buildPath=${rootDir}"/"${projectName}/build
buildVersionPath=$buildPath"/"$android_version
mkdir $buildVersionPath
mv $gameName".zip" $buildVersionPath/

buildListPath=${rootDir}"/BuildTools/buildlist.json"
touch $buildListPath
node gameVersionTools.js $buildPath $android_version $buildListPath

rm $zip_file
rm -rf $temp_dir
rm gameinfo.json
rm gamelist.json
rm -f .zip
rm -f *.zip

echo Postprocessing End ====================================

echo ${remoteUrl}${uploadFileNamePath}/${folder_version}/${gameName}.zip
