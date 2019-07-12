USE [ICARUS]
GO

DECLARE	@return_value int
EXEC	@return_value = [ICARUS].[sp_BackupDatabase]
SELECT	'Return Value' = @return_value

GO
