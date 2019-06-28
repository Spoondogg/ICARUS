/** Find out what containers are dependant on THIS/THESE containerId(s)
	ie: 3109 is a subsection of Containers [1,3270]
	EXEC [ICARUS].[GetContainerParents] 'ryan@spoonmedia.ca', 2682
	EXEC [ICARUS].[GetContainerParents] 'ryan@spoonmedia.ca', '3109,3540,9945'
	EXEC [ICARUS].[GetContainerParents] 'ryan@spoonmedia.ca', 

	@returns A list of Container Ids that THIS/THESE ContainerId(s) is/are a child of
*/
ALTER PROCEDURE [ICARUS].[GetContainerParents]
	@authorId NVARCHAR(128),
	@id VARCHAR(256) -- Comma delimited list of ids -- SELECT * FROM [dbo].[split]('1,2,3',',')
AS BEGIN
WITH [PARENTS] AS (
	SELECT * 
	FROM [ICARUS].[ContainerSubSectionIndex]
	WHERE [childId] IN (
		SELECT CAST([data] AS INT) FROM [dbo].[split](@id,',')
	)
)
SELECT [childId], [PARENTS].[id], [C].[Discriminator] AS [className], 
[C].[label], [C].[tags] FROM [PARENTS]
LEFT JOIN [ICARUS].[Containers] AS [C] ON (
	[PARENTS].[id] = [C].[id]
)
END
