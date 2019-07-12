/**	Return a Paginated List of Containers that match the given query
	EXEC [CONTAINER].[GetSearchableCount] 'ryan@spoonmedia.ca', 'FORM', 'i'
	http://localhost:8052/FORM/search/?page=0&pageLength=10&query=im
*/
ALTER PROCEDURE [CONTAINER].[GetSearchableCount] 
	@authorId NVARCHAR(128),
	@discriminator NVARCHAR(128),
	@query NVARCHAR(128) = null
AS BEGIN

SELECT COUNT(*) AS [count]
	FROM [CONTAINER].[tvf_GetAvailableByDiscriminator](@authorId, @discriminator) AS [C]
	LEFT JOIN [FORMPOST].[tvf_GetAvailableByFormId](@authorId, 0) AS [M] ON ([C].[metaId] = [M].[id])
    WHERE (
		(
			[M].[xmlResults].query('root/description').value('/', 'VARCHAR(128)') LIKE '%' + @query + '%'
			OR @query IS null
		)
		OR [C].[label] LIKE '%' + @query + '%'
	)
END 
