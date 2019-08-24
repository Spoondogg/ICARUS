/**	Get Orphaned Containers
	https://stackoverflow.com/questions/56794747/term-to-represent-a-parent-that-has-children-that-no-longer-exist/56795957#56795957
	@returns A list of Containers without any parent Containers
	EXEC [ICARUS].[GetContainerOrphans] 0
*/
ALTER PROCEDURE [CONTAINER].[GetOrphans] 
	@minAge INT = 60 -- days old
AS BEGIN
	WITH [ContainerParentIndex] AS (
		SELECT [C].[id] AS [containerId], [Discriminator], [subsections], [status],
		--[dateCreated], [dateLastModified],
		DATEDIFF("D", [dateLastModified], GETDATE()) AS [age],
		[SUBS].[id] AS [parentId] --, [SUBS].[childId]
		FROM [ICARUS].[Containers] AS [C]
		LEFT JOIN [CONTAINER].[SubSectionIndex] AS [SUBS] ON ([SUBS].[childId] = [C].[id])
	), 
	[ORPHANS] AS (
		SELECT [containerId], [Discriminator], [subsections], [status], [age], [parentId]
		FROM [ContainerParentIndex]
		WHERE [subsections] = '0'
		AND [parentId] IS NULL
	)
	SELECT [containerId], [Discriminator], [subsections], [status], [age], [parentId]		
	FROM [ORPHANS]
	WHERE [Discriminator] NOT IN ('Main','WORD') AND [age] > @minAge

	/*UPDATE [ICARUS].[Containers]
	SET [status] = -1 
	WHERE [id] IN (
		SELECT [containerId] FROM [TODELETE]
	)*/
END