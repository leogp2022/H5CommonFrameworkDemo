#!/bin/sh

#0.DEBUG 1.RELEASE
buildMode=$1
projectName=$2
buildToolDir=$(cd "$(dirname "$0")";pwd)

rootDir=`pwd`

projectDir=${rootDir}
if [ "$projectName" != "" ]
then
    projectDir=${projectDir}/${projectName}
fi

localDir=${projectDir}/build/web-mobile/
gameName=`cat ${projectDir}/gameinfo.json |jq -r '.zipName'`
android_version=`cat ${projectDir}/gameinfo.json |jq -r '.version'`
uploadFileNamePath=`cat ${projectDir}/gameinfo.json |jq -r '.scheme'`
dlcNames=`cat ${projectDir}/gameinfo.json |jq -r '.dlc'`
gameinfo=`cat ${projectDir}/gameinfo.json`

if [ ! -d "${buildToolDir}/node_modules" ]
then
    cd $buildToolDir
    npm install
    cd $rootDir
fi

debugServerRoot=ubuntu@res.starcdn.cn:/data/www/html/h5games_debug/

if [ $buildMode == 0 ]
then
    serverRoot=ubuntu@res.starcdn.cn:/data/www/html/h5games_debug/
    serverPath=ubuntu@res.starcdn.cn:/data/www/html/h5games_debug/$uploadFileNamePath
    gameList=https://res.starcdn.cn/h5games_debug/config/gamelist.json
    remoteUrl=https://res.starcdn.cn/h5games_debug/
else
    serverRoot=ubuntu@res.starcdn.cn:/data/www/html/h5games_release/
    serverPath=ubuntu@res.starcdn.cn:/data/www/html/h5games_release/$uploadFileNamePath
    gameList=https://res.starcdn.cn/h5games_release/config/gamelist.json
    remoteUrl=https://res.starcdn.cn/h5games_release/
fi

buildPath=${rootDir}/buildtemp
rm -rf $buildPath
mkdir $buildPath
cd $buildPath

echo "Postprocessing Begin =================================="

temp_dir=$android_version
zip_file=$android_version.zip
zip_file_fullName=$gameName"_"$android_version.zip

mkdir ${temp_dir}

cp -r $localDir $temp_dir

if [ -n "${dlcNames}" ] || [ "${dlcNames}" = "" ]
then
    echo "DLC not exist"
else
    echo "DLC Begin ====================="

    rm -rf $uploadFileNamePath
    mkdir $uploadFileNamePath
    folder_version=${android_version//./_}
    path_version=${uploadFileNamePath}/${folder_version}
    mkdir $path_version
    dlcPath=${path_version}/dlc
    mkdir ${dlcPath}

    cd ${temp_dir}/assets

    dlcNameArr=(${dlcNames//,/ })
    for dlcName in ${dlcNameArr[@]}
    do
    dlcZipName=${dlcName}.zip
    zip -q -r ${dlcZipName} ${dlcName}
    rm -rf ${dlcName}
    mv ${dlcZipName} ${buildPath}/${dlcPath}
    done

    echo "DLC End ====================="
fi

cd $buildPath

zip -q -r $zip_file $temp_dir

cp $zip_file $path_version/$gameName".zip"

if [ $buildMode == 0 ]
then
    echo "new upload Begin ===================================="
    echo ${remoteUrl}${uploadFileNamePath}/${folder_version}/${gameName}.zip
    scp -r $uploadFileNamePath $serverRoot
    echo "new upload End ===================================="

    echo "old upload Begin ===================================="
    scp $zip_file $serverPath"/"$zip_file_fullName
    echo "old upload End ===================================="
fi

localBuildPath=${projectDir}/build
buildVersionPath=$localBuildPath"/"$android_version
mkdir $buildVersionPath
if [ $buildMode == 0 ]
then
    buildVersionPath=${buildVersionPath}/debug
else
    buildVersionPath=${buildVersionPath}/release
fi
mkdir $buildVersionPath

cp $zip_file ${buildVersionPath}/${gameName}".zip"
cp -R ${buildPath}/${dlcPath} ${buildVersionPath}

buildListPath=${localBuildPath}"/buildlist.json"
touch $buildListPath
node ${buildToolDir}/gameVersionTools.js $localBuildPath $android_version $buildListPath

echo "Postprocessing End ===================================="
