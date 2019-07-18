/**	Return a Paginated List of Containers that match the given query
	EXEC [CONTAINER].[SearchByTagCount] 'ryan@spoonmedia.ca', '*', 'woot,idea'
	http://localhost:8052/FORM/search/?page=0&pageLength=10&query=im
*/
ALTER PROCEDURE [CONTAINER].[SearchByTagCount] 
	@authorId NVARCHAR(128),
	@discriminator NVARCHAR(128),
	@tag NVARCHAR(256)
AS BEGIN

WITH [Q] AS (
	SELECT [data] AS [tag] FROM [dbo].[split](@tag,',')
), [R] AS (
	SELECT DISTINCT [C].[id]
	FROM [FORMPOST].[Tags] AS [T]
	CROSS APPLY [CONTAINER].[tvf_SearchByTagId](@authorId, @discriminator, [T].[id]) AS [C]
	WHERE [T].[tag] IN (
		SELECT [tag] FROM [Q]
	)
)
SELECT COUNT(*) AS [count]
FROM [R]
END 
