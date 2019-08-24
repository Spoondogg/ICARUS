/**	Parses the given query string into an indexed list of key/value pairs
	SELECT * FROM [STRING].[tvf_ParseSearchString]('a:woot,b:snoot,c:boot,d:foot')
*/
ALTER FUNCTION [STRING].[tvf_ParseSearchString] (
	@query NVARCHAR(256)
) RETURNS TABLE AS RETURN 
	WITH [F1] AS (
		SELECT [split].[id], [split].[data],
		CHARINDEX(':', [split].[data]) AS [splitter]
		FROM [dbo].[split](@query, ',') AS [split]
	), [F2] AS (
		SELECT 
			[F1].[id], 
			SUBSTRING([F1].[data], 0, [F1].[splitter]) AS [key],
			SUBSTRING([F1].[data], [F1].[splitter] + 1, LEN([F1].[data])) AS [value]
		FROM [F1]
	) 
	SELECT [id], [key], [value] FROM [F2]
