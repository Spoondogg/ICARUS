/**	Retrieves a list of Containers with missing children
	
	These Containers will need to have the reference to the missing child removed,
	or they will throw an error.  You should NOT be able to delete a CONTAINER
	without first verifying that it is an orphan.

	@returns A list of Containers that have subsectionIds that no longer exist
	EXEC [CONTAINER].[GetContainersWithMissingChildren] 'ryan@spoonmedia.ca'
*/
ALTER PROCEDURE [CONTAINER].[GetContainersWithMissingChildren] 
	@authorId NVARCHAR(128)
AS BEGIN
	WITH [C] AS (
		SELECT [id], [Discriminator], [dateCreated], [dateLastModified],
		[label], [status], [authorId], [subsections]
		FROM [ICARUS].[Containers]
		WHERE [status] = 1 
		AND ([authorId] = @authorId OR [shared] = 1 OR [isPublic] = 1)
		AND [subsections] != '0'
	), 
	[IDS] AS (
		SELECT [C].[id], [data] AS [childId]
		FROM [C]
		CROSS APPLY [dbo].[split]([C].[subsections],',') AS [SPL]
	),
	--SELECT * FROM [IDS] ORDER BY [containerId], [id] ASC
	[BEREAVED] AS (
		SELECT 
			[IDS].[id], [IDS].[childId], 
			[CN].[Discriminator], [CC].[Discriminator] AS [childDiscriminator], 
			/*[CC].[dateCreated],*/ [CN].[dateLastModified], 
			[CN].[label], [CN].[authorId], [CN].[status], 
			[CN].[subsections]
		FROM [IDS]
		LEFT JOIN [ICARUS].[Containers] AS [CC] ON [CC].[id] = [IDS].[childId]
		LEFT JOIN [C] AS [CN] ON [CN].[id] = [IDS].[id]
	)
	SELECT 
		[id], [childId], [Discriminator], [subsections],
		[dateLastModified], [label], [authorId], [status]
	FROM [BEREAVED] 
	WHERE [childDiscriminator] IS NULL
	--ORDER BY [Discriminator], [id] ASC 
END
GO