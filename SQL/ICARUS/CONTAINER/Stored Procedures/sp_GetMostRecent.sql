/** Retrieves a list of oldest and newest CONTAINERS along with Count Stats
	EXEC [CONTAINER].[GetMostRecent] 'ryan@spoonmedia.ca', 'MAIN'
*/
ALTER PROCEDURE [ICARUS].[GetMostRecent]
	@authorId NVARCHAR(128),
	@discriminator NVARCHAR(128)
AS BEGIN

WITH [CONTAINERS] AS (
	SELECT [Discriminator], COUNT(*) AS [Count], 
	MIN([id]) AS [oldestId], MAX([id]) AS [newestId]
	FROM [ICARUS].[Containers] GROUP BY [Discriminator]
)
SELECT * FROM [CONTAINERS] AS [I]
LEFT JOIN [ICARUS].[Containers] AS [C] ON (
	[I].[newestId] = [C].[id]
)
ORDER BY [I].[Discriminator]

END 
GO