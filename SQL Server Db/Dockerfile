
FROM mcr.microsoft.com/mssql/server:2019-latest
WORKDIR /

USER root
RUN mkdir -p /initdatabase
COPY ./restoredbscript.sql /initdatabase
COPY ./calendardb.bak /var/opt/mssql/data/backup/
COPY ./initdb.sh /initdatabase
COPY ./entrypoint.sh /initdatabase

# Grant permissions for the import-data script to be executable
RUN chmod +x ./initdatabase/initdb.sh

CMD /bin/bash ./initdatabase/entrypoint.sh