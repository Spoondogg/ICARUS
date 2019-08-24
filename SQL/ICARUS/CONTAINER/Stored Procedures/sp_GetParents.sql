/** Find out what containers are dependant on THIS/THESE containerId(s)
	ie: 3109 is a subsection of Containers [1,3270]
	EXEC [CONTAINER].[GetParents] 'ryan@spoonmedia.ca', '3109'
	EXEC [CONTAINER].[GetParents] 'ryan@spoonmedia.ca', '3109,3540,9945'
	@returns A list of Container Ids that THIS/THESE ContainerId(s) is/are a child of
*/
ALTER PROCEDURE [CONTAINER].[GetParents]
	@authorId NVARCHAR(128),
	@id NVARCHAR(256) = '' -- Comma delimited list of ids -- SELECT * FROM [dbo].[split]('1,2,3',',')
AS BEGIN
WITH [PARENTS] AS (
	SELECT * 
	FROM [CONTAINER].[SubSectionIndex]
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
