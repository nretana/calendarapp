#!/bin/bash

apt-get update
apt-get install curl -y
apt-get install sudo -y

update-ca-certificates
cd /apigateway 
dotnet "Calendar.Gateway.dll"