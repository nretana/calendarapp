#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.


FROM mcr.microsoft.com/dotnet/aspnet:7.0  AS base
WORKDIR /
RUN mkdir -p /initApp
COPY ./Calendar.Appointment.API/entrypoint.sh /initApp 

WORKDIR /calendarapi

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Calendar.Appointment.API/Calendar.Appointment.API.csproj", "Calendar.Appointment.API/"]
COPY ["Calendar.Shared/Calendar.Shared.csproj", "Calendar.Shared/"]
RUN dotnet restore "./Calendar.Appointment.API/./Calendar.Appointment.API.csproj"
COPY . .
WORKDIR "/src/Calendar.Appointment.API"
RUN dotnet build "./Calendar.Appointment.API.csproj" -c $BUILD_CONFIGURATION -o /calendarapi/build


FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Calendar.Appointment.API.csproj" -c $BUILD_CONFIGURATION -o /calendarapi/publish /p:UseAppHost=false


FROM base AS final
EXPOSE 443
WORKDIR /calendarapi
COPY --from=publish /calendarapi/publish .

WORKDIR /
USER root
RUN chmod +x ./initApp/entrypoint.sh
CMD /bin/bash ./initApp/entrypoint.sh