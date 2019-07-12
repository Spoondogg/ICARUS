/**	Get Description for given Container (if exists)
	EXEC [CONTAINER].[GetDescription] 'ryan@spoonmedia.ca', 'MAIN'
*/
ALTER PROCEDURE [CONTAINER].[GetDescription]
	@authorId NVARCHAR(128),
	@discriminator NVARCHAR(256)
AS BEGIN
SELECT 
	[C].[id], [subsections], --[metaId], [xmlResults],
	[Discriminator] AS [className], [tags], [label],
	--[M].[xmlResults] --, [M].[jsonResults]
	[M].[xmlResults].query('root/description').value('/', 'VARCHAR(256)') AS [Desc]
FROM [CONTAINER].[tvf_GetAvailableByDiscriminator](@authorId, @discriminator) AS [C]
LEFT JOIN [FORMPOST].[tvf_GetAvailableByFormId](@authorId, 0) AS [M] ON (
	[C].[metaId] = [M].[id]
)
END
GO