/**	Disable Orphaned Containers
	@returns A list of Containers without any parent Containers
	EXEC [ICARUS].[PurgeContainerOrphans] 360
*/
ALTER PROCEDURE [ICARUS].[PurgeContainerOrphans] 
	@minAge INT = 60 -- days old
AS BEGIN
	WITH [ContainerParentIndex] AS (
		SELECT [C].[id] AS [containerId], [Discriminator], [subsections],
		--[dateCreated], [dateLastModified],
		DATEDIFF("D", [dateLastModified], GETDATE()) AS [age],
		[SUBS].[id] AS [parentId] --, [SUBS].[childId]
		FROM [ICARUS].[Containers] AS [C]
		LEFT JOIN [CONTAINER].[SubSectionIndex] AS [SUBS] ON ([SUBS].[childId] = [C].[id])
	), 
	[ORPHANS] AS (
		SELECT [containerId], [Discriminator], [subsections], [age], [parentId]
		FROM [ContainerParentIndex]
		WHERE [subsections] = '0'
		AND [parentId] IS NULL
	),
	[TODELETE] AS (
		SELECT [containerId], [Discriminator], [subsections], [age], [parentId]		
		FROM [ORPHANS]
		WHERE [Discriminator] NOT IN ('Main','WORD') AND [age] > @minAge
	)

	UPDATE [ICARUS].[Containers]
	SET [status] = -1 
	WHERE [id] IN (
		SELECT [containerId] FROM [TODELETE]
	)
END
GO