#!/bin/sh

if [ $# != 2 ] ; then
	echo "Usage: ./xxx.sh local-files remote-folder"
	exit 1
fi


BASEDIR=$(dirname $0)
echo "Script location: ${BASEDIR}"

local_files=$1
remote_dir=$2

#Ucloud
USER_HOME=$(eval echo ~${SUDO_USER})
res_server=res.starcdn.cn
res_server_user=ubuntu
res_server_path=/data/www/html


echo "remote server:"${res_server_path}/${remote_dir}/

ssh -p 22 ${res_server_user}@${res_server} "mkdir -p ${res_server_path}/${remote_dir}"
rsync -vaLc --progress --exclude '*.meta' --exclude '*.manifest' -e "ssh -p 22 " ${local_files} ${res_server_user}@${res_server}:${res_server_path}/${remote_dir}/

#ssh -p 22 ${res_server_user}@${res_server} "rm -rf ${res_server_path}/${remote_parent_dir}/current && ln -s ${res_server_path}/${remote_dir} ${res_server_path}/${remote_parent_dir}/current"
