#!/bin/sh

apt-get update
apt-get install curl -y
apt-get install sudo -y
#using rabbitmqctl, export the schema definitions of your local rabbitmq 
#Run command: rabbitmqctl export_definitions <set-this-path>/definitions.file.json
#copy and paste this file in this directory
#this file contains existing users, virtual hosts that are needed to stablish connection with the rabbitMQ server.
#if you don't want to restore any file, use the default values and update appsettings.json (web api app)
#where you need to connect to rabbitMQ server.
/opt/rabbitmq/sbin/rabbitmqctl import_definitions ./init/definitions.default.json