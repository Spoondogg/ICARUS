/**
	Extracts a WORD from the given XML result set (FormPost)
*/
ALTER FUNCTION [LINGU].[GetWord](
	@xmlResults xml 
) RETURNS VARCHAR(128) WITH SCHEMABINDING AS BEGIN
	RETURN @xmlResults.query('root/value').value('/', 'VARCHAR(128)')
END
GO