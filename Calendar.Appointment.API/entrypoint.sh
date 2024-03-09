#!/bin/bash
update-ca-certificates

#execute dotnet int apigateway
#otherwise, you will get issues retrieving any local file (.json, etc) in dotnet app
cd /calendarapi
echo 'Waiting for RabbitMQ to be ready...'
sleep 30
dotnet "Calendar.Appointment.API.dll"