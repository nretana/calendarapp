EXEC('RESTORE FILELISTONLY FROM DISK = ''/var/opt/mssql/data/backup/calendardb.bak'' ')
EXEC('RESTORE DATABASE [Calendardb] FROM DISK = ''/var/opt/mssql/data/backup/calendardb.bak'' WITH MOVE ''calendardb'' TO ''/var/opt/mssql/data/Calendardb.mdf'', MOVE ''calendardb_log'' TO ''/var/opt/mssql/data/Calendardb.ldf'' ')
