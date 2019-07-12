/**
	Extracts the specified Statement value from a FormPost
*/
ALTER FUNCTION [LINGU].[GetStatement](
	@xmlResults xml
) RETURNS VARCHAR(128) WITH SCHEMABINDING AS BEGIN
	RETURN @xmlResults.query('root/statement').value('/', 'VARCHAR(128)')
END
GO