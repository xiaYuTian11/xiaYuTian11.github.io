---
title: java程序部署一键启停sh脚本,兼容版本升级，无须修改配置
abbrlink: 9c2f68c4
date: 2023-04-11 14:00:56
tags: [java,spring,springboot,shell]
---

 java程序部署一键启停sh脚本,兼容版本升级，无须修改配置,下面贴一下自己常用java 部署sh脚本，具体如何打包请参照上一篇[博客](https://tanmw.top/archives/24385ec7.html)

<!-- more -->

## 普通版本

### start.sh

```sh
#!/bin/bash
VM_OPTS="-Xms512m -Xmx2048m"
SPB_OPTS=" -Dloader.path=lib,config"
#替换jar包路径及文件
APP_LOCATION="/home/demo/service/"
APP_NAME="demo-1.0-dev.jar"
#使用说明,用来提示输入参数
usage() {
  echo "Usage: sh 执行脚本.sh [start|stop|restart|status]"
  exit 1
}
#检查程序是否在运行
is_exist() {
  pid=$(ps -ef | grep $APP_NAME | grep -v grep | awk '{print $2}')
  #如果不存在返回1,存在返回0
  if [ -z "${pid}" ]; then
    return 1
  else
    return 0
  fi
}

#启动方法
start() {
  is_exist
  if [ $? -eq "0" ]; then
    echo "${APP_NAME} is already running. pid=${pid} ."
  else
    nohup java $VM_OPTS -jar $APP_LOCATION$APP_NAME $SPB_OPTS >/dev/null 2>&1 &
    pid=$(ps -ef | grep $APP_NAME | grep -v grep | awk '{print $2}')
    echo "${APP_NAME} start success. pid=${pid} ."
  fi
}

#停止方法
stop() {
  is_exist
  if [ $? -eq "0" ]; then
    kill -9 $pid
    echo "${APP_NAME} stop success. pid=${pid} ."
  else
    echo "${APP_NAME} is not running"
  fi
}

#输出运行状态
status() {
  is_exist
  if [ $? -eq "0" ]; then
    echo "${APP_NAME} is running. Pid is ${pid}"
  else
    echo "${APP_NAME} is NOT running."
  fi
}
#重启
restart() {
  stop
  start
}

#根据输入参数,选择执行对应方法,不输入则执行使用说明
case "$1" in
"start")
  start
  ;;
"stop")
  stop
  ;;
"status")
  status
  ;;
"restart")
  restart
  ;;
*)
  usage
  ;;
esac

```



## 进阶版本

​		普通版本如果jar升级，名称发送变化后，会涉及修改脚本，这个版本在此基础上进行了完善，同时针对服务器时间不一致的情况进行优化

### start.sh

```sh
#!/bin/bash

SERVICE_NAME="demo"
MAIN_CLASS="top.tanmw.DemoApplication"
APP_BASE_PATH=$(cd `dirname $0`;cd ..; pwd)
JAVA_OPTS="-Xms16g -Xmx16g -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=${APP_BASE_PATH} "
SH_NAME="shell/start.sh"
JAVA_HOME="/usr/java/jdk1.8.0_361/bin/java"
CP=${APP_BASE_PATH}/*:${APP_BASE_PATH}/lib/*:${APP_BASE_PATH}/config/
PID_FILE=${APP_BASE_PATH}/${SERVICE_NAME}.pid
SERVICE_FILE=/usr/lib/systemd/system/${SERVICE_NAME}.service

COMMAND="$1"
if [[ "$COMMAND" != "start" ]] && [[ "$COMMAND" != "stop" ]] && [[ "$COMMAND" != "restart" ]] && [[ "$COMMAND" != "install" ]]; then
	echo "Usage: $0 start | stop | restart | install "
	exit 0
fi

function start()
{
    cd ${APP_BASE_PATH}
    nohup ${JAVA_HOME}  ${JAVA_OPTS}  -cp ${CP} ${MAIN_CLASS} -Duser.timezone=Asia/Shanghai -Dfile.encoding=utf8 >/dev/null 2>&1 &
    echo $! > "$PID_FILE"
    echo "${SERVICE_NAME} start success. pid=$(cat ${PID_FILE}) ."
}

function stop()
{
    PID=$(cat ${PID_FILE})
    kill -15 ${PID}
    SLEEP=30
    SLEEP_COUNT=1
    while [[ ${SLEEP} -ge 0 ]]; do
        kill -0 ${PID} >/dev/null 2>&1
        if [[ $? -gt 0 ]]; then
          rm -f ${PID_FILE} >/dev/null 2>&1
          if [[ $? != 0 ]]; then
            if [[ -w ${PID_FILE} ]]; then
              cat /dev/null > ${PID_FILE}
            fi
          fi
          break
        fi
        if [[ ${SLEEP} -gt 0 ]]; then
          sleep 1
        fi
        if [[ ${SLEEP} -eq 0 ]]; then
          kill -3 `cat ${PID_FILE}`
          kill -9 `cat ${PID_FILE}`
        fi
        SLEEP=`expr ${SLEEP} - 1`
        SLEEP_COUNT=`expr ${SLEEP_COUNT} + 1`
    done
     echo "${SERVICE_NAME} stop success. pid=${PID} ."
}

function install() {
    GB_SERVICE=`systemctl status ${SERVICE_NAME} | grep Active | awk '{print $3}' | cut -d "(" -f2 | cut -d ")" -f1`
    if [[ "$GB_SERVICE" == "running" ]];then
        echo "服务正在运行中,即将重新安装服务!"
        echo "停止服务"
        systemctl stop ${SERVICE_NAME}
        install_service
        echo "启动服务"
        systemctl start ${SERVICE_NAME}
    else
        install_service
        echo "安装完成!启动服务中!"
        systemctl start ${SERVICE_NAME}
    fi
}

function install_service() {
    sudo rm -rf ${SERVICE_FILE}
    SERVICE="[Unit]\nDescription=$SERVICE_NAME\nAfter=network.target\n\n[Service]\nType=forking\nExecStart=/bin/sh $APP_BASE_PATH/$SH_NAME start\nExecReload=/bin/sh $APP_BASE_PATH/$SH_NAME restart\nExecStop=/bin/sh $APP_BASE_PATH/$SH_NAME stop\nRestart=on-failure\n\n[Install]\nWantedBy=multi-user.target"
    echo "安装服务中..."
    sudo echo -e ${SERVICE} > ${SERVICE_FILE}
    echo "修改服务权限644中..."
    sudo chmod 644 ${SERVICE_FILE}
    echo "重载服务中..."
    systemctl daemon-reload
    echo "设置开机自启动..."
    systemctl enable ${SERVICE_NAME}
}


if [[ "$COMMAND" == "start" ]]; then
	start
elif [[ "$COMMAND" == "stop" ]]; then
    stop
elif [[ "$COMMAND" == "restart" ]]; then
    stop
    start
elif [[ "$COMMAND" == "install" ]]; then
    install
else
    echo "Usage: $0 start | stop | restart | install"
	exit 0
fi
```



## 常用命令

```sh
-- 设置开机自启
systemctl enable demo
-- 启动服务
systemctl start demo
-- 停止服务
systemctl stop demo
-- 重启服务
systemctl restart demo
-- 查看服务状态
systemctl status demo
```

