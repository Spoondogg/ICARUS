/**	Return a Paginated List of Containers that match the given query
	EXEC [FORMPOST].[GetSearchableCount] 'ryan@spoonmedia.ca', 10128, 'tag:w,tag:b'
	http://localhost:8052/FORM/search/?page=0&pageLength=10&query=im
*/
ALTER PROCEDURE [FORMPOST].[GetSearchableCount] 
	@authorId NVARCHAR(128),
	@formId INT = 0,
	@query NVARCHAR(128) = null
AS BEGIN
	SELECT COUNT(*) AS [count]
	FROM [STRING].[tvf_ParseSearchString](@query) AS [Q]
	CROSS APPLY [FORMPOST].[tvf_SearchByFormId](
		@authorId, @formId, [Q].[key], [Q].[value]
	)
END 
