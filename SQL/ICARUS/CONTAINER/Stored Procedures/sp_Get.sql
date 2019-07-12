/**	Return a Container and its associated FormPost Objects
	EXEC [CONTAINER].[Get] 'ryan@spoonmedia.ca', 'MAIN'
	EXEC [CONTAINER].[Get] 'ryan@spoonmedia.ca', 'MAIN', 1
	EXEC [CONTAINER].[Get] 'ryan@spoonmedia.ca', 'WORD'
*/
ALTER PROCEDURE [CONTAINER].[Get]
	@authorId NVARCHAR(128),
	@Discriminator NVARCHAR(128) = '*',
	@id INT = 0
AS BEGIN
	SELECT 
		[C].[id], [C].[subsections], [C].[element], [C].[label], [C].[tags], [C].[Discriminator],
		[C].[authorId], [C].[status], [C].[shared], [C].[dateCreated], [C].[dateLastModified],
		[C].[attributesId], 		
		--[ATTR].[formId], --[ATTR].[timestamp], [ATTR].[version], [ATTR].[authorId], 
		[ATTR].[xmlResults] AS [attrXML], [ATTR].[jsonResults] AS [attrJSON],
		[C].[dataId],
		--[DATA].[formId], [DATA].[timestamp], [DATA].[version], [DATA].[authorId],
		[DATA].[xmlResults] AS [dataXML], [DATA].[jsonResults] AS [dataJSON],
		[C].[metaId],
		--[DESC].[formId], [DESC].[timestamp], [DESC].[version], [DESC].[authorId],
		[DESC].[xmlResults] AS [descXML], [DESC].[jsonResults] AS [descJSON]
	FROM [CONTAINER].[tvf_GetAvailableByDiscriminator](@authorId, @Discriminator) AS [C]
	LEFT JOIN [ICARUS].[FormPosts] AS [ATTR] ON ([C].[attributesId] = [ATTR].[id])
	LEFT JOIN [ICARUS].[FormPosts] AS [DATA] ON ([C].[dataId] = [DATA].[id])
	LEFT JOIN [ICARUS].[FormPosts] AS [DESC] ON ([C].[metaId] = [DESC].[id])
	WHERE [C].[id] = @id OR @id = 0
	--ORDER BY [C].[Discriminator]
END
GO