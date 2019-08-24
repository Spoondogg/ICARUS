/** Retrieves a list of oldest and newest CONTAINERS along with Count Stats
	EXEC [CONTAINER].[GetStats] 'ryan@spoonmedia.ca', 'MAIN'
*/
ALTER PROCEDURE [CONTAINER].[GetStats]
	@authorId NVARCHAR(128),
	@discriminator NVARCHAR(128)
AS BEGIN

WITH [CONTAINERS] AS (
	SELECT [Discriminator], COUNT(*) AS [Count], 
	MIN([id]) AS [oldestId], MAX([id]) AS [newestId]
	FROM [ICARUS].[Containers] 
	WHERE [status] != -1
	GROUP BY [Discriminator]
)
SELECT * FROM [CONTAINERS] AS [I]
ORDER BY [I].[Discriminator]

END 
GO