/** Retrieves a list of containers along with their relevant parent Id (if exists)
	SELECT * FROM [CONTAINER].[ParentIndex]
*/
ALTER VIEW [CONTAINER].[ParentIndex] AS 
	SELECT 
		[C].[id] AS [containerId], [Discriminator], [subsections], [status],
		[SUBS].[id] AS [parentId]
	FROM [ICARUS].[Containers] AS [C]
	LEFT JOIN [CONTAINER].[SubSectionIndex] AS [SUBS] ON ([SUBS].[childId] = [C].[id])
GO