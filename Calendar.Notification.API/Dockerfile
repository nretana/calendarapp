#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.


FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /
RUN mkdir -p /initApp
COPY ./Calendar.Notification.API/entrypoint.sh /initApp

WORKDIR /notificationapi

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Calendar.Notification.API/Calendar.Notification.API.csproj", "Calendar.Notification.API/"]
COPY ["Calendar.Shared/Calendar.Shared.csproj", "Calendar.Shared/"]
RUN dotnet restore "./Calendar.Notification.API/./Calendar.Notification.API.csproj"
COPY . .
WORKDIR "/src/Calendar.Notification.API"
RUN dotnet build "./Calendar.Notification.API.csproj" -c $BUILD_CONFIGURATION -o /notificationapi/build


FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Calendar.Notification.API.csproj" -c $BUILD_CONFIGURATION -o /notificationapi/publish /p:UseAppHost=false


FROM base AS final
EXPOSE 443
WORKDIR /notificationapi
COPY --from=publish /notificationapi/publish .

WORKDIR /
USER root
RUN chmod +x ./initApp/entrypoint.sh
CMD /bin/bash ./initApp/entrypoint.sh