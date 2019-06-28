/**	Return a Container and its associated FormPost Objects
	EXEC [ICARUS].[GetContainer] 'ryan@spoonmedia.ca'
	EXEC [ICARUS].[GetContainer] 'ryan@spoonmedia.ca', 'WORD'
*/
ALTER PROCEDURE [ICARUS].[GetContainer]
	@authorId NVARCHAR(128),
	@Discriminator NVARCHAR(128) = '*',
	@id INT = 0
AS BEGIN 
	WITH [CONTAINERS] AS (
		SELECT * FROM [ICARUS].[Containers] 
		WHERE 
			([id] = @id OR @id = 0) 
			AND [status] > 0
			AND (
				[Discriminator] = @Discriminator 
				OR @Discriminator = '*'		
			) AND (
				[authorId] = @authorId
				OR [shared] = 1
			)		
	)
	SELECT 
		[CONTAINERS].[id], [CONTAINERS].[subsections], [CONTAINERS].[element], [CONTAINERS].[label], [CONTAINERS].[tags], [CONTAINERS].[Discriminator],
		--[CONTAINERS].[authorId], [CONTAINERS].[status], [CONTAINERS].[shared], [CONTAINERS].[dateCreated], [CONTAINERS].[dateLastModified],
		[CONTAINERS].[attributesId], 		
		--[ATTR].[formId], --[ATTR].[timestamp], [ATTR].[version], [ATTR].[authorId], 
		[ATTR].[xmlResults] AS [attrXML], [ATTR].[jsonResults] AS [attrJSON],
		[CONTAINERS].[dataId],
		--[DATA].[formId], [DATA].[timestamp], [DATA].[version], [DATA].[authorId],
		[DATA].[xmlResults] AS [dataXML], [DATA].[jsonResults] AS [dataJSON],
		[CONTAINERS].[metaId],
		--[DESC].[formId], [DESC].[timestamp], [DESC].[version], [DESC].[authorId],
		[DESC].[xmlResults] AS [descXML], [DESC].[jsonResults] AS [descJSON]
	FROM [CONTAINERS]
	LEFT JOIN [ICARUS].[FormPosts] AS [ATTR] ON (
		[CONTAINERS].[attributesId] = [ATTR].[id]
	)
	LEFT JOIN [ICARUS].[FormPosts] AS [DATA] ON (
		[CONTAINERS].[dataId] = [DATA].[id]
	)
	LEFT JOIN [ICARUS].[FormPosts] AS [DESC] ON (
		[CONTAINERS].[metaId] = [DESC].[id]
	)
	ORDER BY [CONTAINERS].[Discriminator]
END
GO