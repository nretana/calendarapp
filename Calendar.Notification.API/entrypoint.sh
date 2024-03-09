#!/bin/bash

apt-get update
apt-get install curl -y
apt-get install iputils-ping -y
apt-get install sudo -y

update-ca-certificates
cd /notificationapi

echo 'Waiting for RabbitMQ to be ready...'
sleep 30
dotnet "Calendar.Notification.API.dll"