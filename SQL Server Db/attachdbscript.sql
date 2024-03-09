
EXEC('
      DECLARE @count INT;
	  SELECT @count = Count(*) FROM sys.databases WHERE name = ''calendardb''
	  IF @count = 0  
	  BEGIN
		CREATE DATABASE [Calendardb] ON
		(FILENAME = N''/var/opt/mssql/data/calendardb.mdf''),
		(FILENAME = N''/var/opt/mssql/data/calendardb_log.ldf'')
		FOR ATTACH
	  END;
');