#!/bin/bash


apt-get update
apt-get install curl -y
apt-get install iputils-ping -y
apt-get install sudo -y

update-ca-certificates

/opt/rabbitmq/sbin/rabbitmq-server