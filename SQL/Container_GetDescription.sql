/**	Get Description for given Container (if exists)
	EXEC [ICARUS].[GetDescription] 'ryan@spoonmedia.ca'
*/
ALTER PROCEDURE [ICARUS].[GetDescription]
	@authorId NVARCHAR(128) --= 'ryan@spoonmedia.ca';
AS BEGIN
WITH [CONTAINERS] AS (
	SELECT [id], [subsections], [Discriminator], [label], [tags], [metaId]
	FROM [ICARUS].[Containers]
	WHERE [status] = 1 
	AND [metaId] > 0
	AND ([authorId] = @authorId OR [shared] = 1)
)
SELECT 
	[CONTAINERS].[id], [subsections], 
	[Discriminator] AS [className], [tags], [label],
	--[POST].[xmlResults] --, [POST].[jsonResults]
	[POST].[xmlResults].query('root/description').value('/', 'VARCHAR(256)') AS [Desc]
FROM [CONTAINERS]
LEFT JOIN [ICARUS].[FormPosts] AS [POST] ON (
	[CONTAINERS].[metaId] = [POST].[id]
	AND [POST].[status] != -1 
	AND ([POST].[authorId] = @authorId OR [POST].[shared] = 1)
)
END
GO