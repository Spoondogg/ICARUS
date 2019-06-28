/** Retrieves a list of containers along with their relevant parent Id (if exists)
	SELECT * FROM [ICARUS].[ContainerParentIndex]
*/
ALTER VIEW [ICARUS].[ContainerParentIndex] AS 
	SELECT 
		[C].[id] AS [containerId], [Discriminator], [subsections], [status],
		[SUBS].[id] AS [parentId]
	FROM [ICARUS].[Containers] AS [C]
	LEFT JOIN [ICARUS].[ContainerSubSectionIndex] AS [SUBS] ON ([SUBS].[childId] = [C].[id])
GO