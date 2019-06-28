/** Find out what containers are dependant on THIS container ie: 3109 is a subsection of 1,3270
	EXEC [ICARUS].[GetContainerParents] 'ryan@spoonmedia.ca', 9906
	@returns A list of Container Ids that THIS Container is a child of
*/
ALTER PROCEDURE [ICARUS].[GetContainerParents]
	@authorId NVARCHAR(128), --= 'ryan@spoonmedia.ca';
	@id INT -- = 3109;
AS BEGIN
WITH [CONTAINER] AS (
	SELECT [id], [subsections], [Discriminator], [label], [tags] 	
	FROM [ICARUS].[Containers] 
	WHERE [status] = 1 
	AND ([authorId] = @authorId OR [shared] = 1)
), [SUBS] AS (
	SELECT 
		[CONTAINER].[id],
		[sub].[data] AS [subsectionId] 
	FROM [CONTAINER]
	CROSS APPLY [dbo].[split]([CONTAINER].[subsections],',') AS [sub]
), [PARENTS] AS (
	SELECT * FROM [SUBS] 
	WHERE [subsectionId] = @id
)
--SELECT * FROM [CONTAINER]
--SELECT * FROM [SUBS]
--SELECT * FROM [PARENTS]
--SELECT COUNT(*) FROM [PARENTS]
SELECT [PARENTS].[id], [C].[Discriminator] AS [className], [C].[label], [C].[tags] FROM [PARENTS]
LEFT JOIN [CONTAINER] AS [C] ON (
	[PARENTS].[id] = [C].[id]
)
END
GO