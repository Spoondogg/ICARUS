/**	Return a Paginated List of Containers that match the given query
	EXEC [ICARUS].[GetSearchCount_Container] 'ryan@spoonmedia.ca', 'Form', 'imp'
	http://localhost:8052/FORM/search/?page=0&pageLength=10&query=im
*/
ALTER PROCEDURE [ICARUS].[GetSearchCount_Container] 
	@authorId NVARCHAR(128),
	@discriminator NVARCHAR(128),
	@query NVARCHAR(128) = null
AS BEGIN

SELECT COUNT(*) AS [count]
    FROM [ICARUS].[Containers] AS [C]
	LEFT JOIN [ICARUS].[FormPosts] AS [M] ON (
		[C].[metaId] = [M].[id]
		AND [M].[status] != -1
		AND	(
			[M].[authorId] = @authorId 
			OR [M].[shared] = 1 
			OR [M].[isPublic] = 1
		)	
	)
    WHERE [Discriminator] = @discriminator
	AND [C].[status] != -1
	AND	(
		[C].[authorId] = @authorId 
		OR [C].[shared] = 1 
		OR [C].[isPublic] = 1
	)
	AND (
		(
			[M].[xmlResults].query('root/description').value('/', 'VARCHAR(128)') LIKE '%' + @query + '%'
			OR @query IS null
		)
		OR [C].[label] LIKE '%' + @query + '%'
	)
END 
