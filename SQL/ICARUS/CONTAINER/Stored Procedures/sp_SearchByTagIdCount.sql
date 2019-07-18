/**	Return a Paginated List of Containers that match the given query
	EXEC [CONTAINER].[SearchByTagIdCount] 'ryan@spoonmedia.ca', '*', '14449,14577'
	http://localhost:8052/FORM/search/?page=0&pageLength=10&query=im
*/
ALTER PROCEDURE [CONTAINER].[SearchByTagIdCount] 
	@authorId NVARCHAR(128),
	@discriminator NVARCHAR(128),
	@tag NVARCHAR(256)
AS BEGIN

WITH [Q] AS (
	SELECT [data] AS [tagId] FROM [dbo].[split](@tag,',')
), [R] AS (
	SELECT DISTINCT [C].[id] FROM [Q]
	CROSS APPLY [CONTAINER].[tvf_SearchByTagId](@authorId, @discriminator, [Q].[tagId]) AS [C]
)
SELECT COUNT(*) AS [count]
FROM [R]
END 
