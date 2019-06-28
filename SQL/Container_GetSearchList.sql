/**	Return a Paginated List of Containers that match the given query
	EXEC [ICARUS].[GetSearchList] 'ryan@spoonmedia.ca', 'Form', 20, 0, 'or'
	http://localhost:8052/FORM/search/?page=0&pageLength=10&query=im
*/
ALTER PROCEDURE [ICARUS].[GetSearchList] 
	@authorId NVARCHAR(128),
	@discriminator NVARCHAR(128),
	@pageLength INT = 5,
	@page INT = 0,
	@query NVARCHAR(128) = null
AS BEGIN

DECLARE @rowStart INT = (@pageLength * @page) + 1;
DECLARE @rowEnd INT = @rowStart + @pageLength;

SELECT 
	[rowNum] - 1 AS [index], [id], [subsections], 
	[element], [Discriminator] AS [className],
	[authorId], [status], [label], ISNULL([tags],'0') AS [tags],
	[dateCreated], [dateLastModified], 
	[attributesId], [dataId], [metaId], [shared], [isPublic],
	ISNULL([description],'') AS [description]
 
FROM ( 
	SELECT ROW_NUMBER() OVER ( ORDER BY [C].[id] ) AS [rowNum], 
	[C].[id], [C].[subsections], [C].[element], 
	[C].[Discriminator], [C].[authorId], [C].[status], 
	[C].[label], [C].[tags], [C].[dateCreated], [C].[dateLastModified], 
	[C].[attributesId], [C].[dataId], [C].[metaId], 
	[C].[shared], [C].[isPublic],
	[M].[xmlResults].query('root/description').value('/', 'VARCHAR(128)') AS [description]
	--[M].[xmlResults].query('root/tags').value('/', 'VARCHAR(128)') AS [tags]
    FROM [ICARUS].[Containers] AS [C]
	LEFT JOIN [ICARUS].[FormPosts] AS [M] ON (
		[C].[metaId] = [M].[id]
		AND [M].[status] != -1
		AND	([M].[authorId] = @authorId OR [M].[shared] = 1 OR [M].[isPublic] = 1)	
	)
    WHERE [Discriminator] = @discriminator
	AND [C].[status] != -1
	AND	([C].[authorId] = @authorId OR [C].[shared] = 1 OR [C].[isPublic] = 1)
	AND (
		(
			[M].[xmlResults].query('root/description').value('/', 'VARCHAR(128)') LIKE '%' + @query + '%'
			OR @query IS null
		)
		OR [C].[label] LIKE '%' + @query + '%'
	)
) AS [RowConstrainedResult]
WHERE [rowNum] >= @rowStart AND [RowNum] < @rowEnd

ORDER BY [rowNum]

END 
