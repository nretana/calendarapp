#!/bin/bash
sleep 30s

/opt/mssql-tools/bin/sqlcmd -S 127.0.0.1 -U sa -P $MSSQL_SA_PASSWORD -d master -i ./initdatabase/attachdbscript.sql