/** An index of CONTAINERS and their relative subsections 
	SELECT TOP 10 * FROM [ICARUS].[ContainerSubSectionIndex]
*/
ALTER VIEW [ICARUS].[ContainerSubSectionIndex] AS
	SELECT DISTINCT
		[C].[id], [SUB].[data] AS [childId]/*, [Discriminator], 
		[dateCreated], [dateLastModified],
		[label], [status], [authorId] --, [subsections]	*/
	FROM [ICARUS].[Containers] AS [C]
	CROSS APPLY [dbo].[split]([C].[subsections],',') AS [SUB]
	WHERE [status] = 1 
	--AND ([authorId] = @authorId OR [shared] = 1 OR [isPublic] = 1)
	AND [subsections] != '0'
GO