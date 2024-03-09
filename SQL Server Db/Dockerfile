
FROM mcr.microsoft.com/mssql/server:2019-latest
WORKDIR /

USER root
RUN mkdir -p /initdatabase
COPY ./attachdbscript.sql /initdatabase
COPY ./entrypoint.sh /initdatabase

# Grant permissions for the import-data script to be executable
RUN chmod +x ./initdatabase/entrypoint.sh

CMD /bin/bash ./initdatabase/entrypoint.sh