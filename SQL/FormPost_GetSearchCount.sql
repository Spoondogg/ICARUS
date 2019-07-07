/**	Return a Paginated List of Containers that match the given query
	EXEC [ICARUS].[GetSearchCount_FormPost] 'ryan@spoonmedia.ca', 10128, 'tag:w,tag:b'
	http://localhost:8052/FORM/search/?page=0&pageLength=10&query=im
*/
ALTER PROCEDURE [ICARUS].[GetSearchCount_FormPost] 
	@authorId NVARCHAR(128),
	@formId INT = 0,
	@query NVARCHAR(128) = null
AS BEGIN

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
	SELECT COUNT(*) AS [count]
    FROM [F2]
	CROSS APPLY [ICARUS].[tvf_SearchFormPostById](
		@authorId, @formId, [F2].[key], [F2].[value]
	)
END 
