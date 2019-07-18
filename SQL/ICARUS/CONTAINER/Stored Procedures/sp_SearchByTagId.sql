/** Retrieves a list of Containers that match on the given tag string(s)
	EXEC [CONTAINER].[SearchByTagId] 'ryan@spoonmedia.ca', '*', '14449,14577'
*/
ALTER PROCEDURE [CONTAINER].[SearchByTagId]
	@authorId NVARCHAR(128),
	@discriminator NVARCHAR(128),
	@tag NVARCHAR(256),
	@pageLength INT = 5,
	@page INT = 0
AS BEGIN 

DECLARE @rowStart INT = (@pageLength * @page) + 1;
DECLARE @rowEnd INT = @rowStart + @pageLength;

WITH [Q] AS (
	SELECT [data] AS [tagId] FROM [dbo].[split](@tag,',')
), [R] AS (
	SELECT DISTINCT
		[C].[id],
		[C].[subsections],
		[C].[element],
		[C].[label],
		[C].[Discriminator],
		[C].[authorId],
		[C].[status],
		[C].[shared],
		[C].[isPublic],
		[C].[dateCreated],
		[C].[dateLastModified],
		[C].[attributesId],
		[C].[dataId],
		[C].[metaId],
		[C].[tags]
	FROM [Q]
	CROSS APPLY [CONTAINER].[tvf_SearchByTagId](@authorId, @discriminator, [Q].[tagId]) AS [C]
)

SELECT 
	[rowNum] - 1 AS [index], [id], [subsections], 
	[element], [Discriminator] AS [className],
	[authorId], [status], [label], [tags], --ISNULL([tags],'0') AS [tags],
	[dateCreated], [dateLastModified], 
	[attributesId], [dataId], [metaId], [shared], [isPublic],
	[tags]
	--ISNULL([description],'') AS [description]

FROM ( 
	SELECT ROW_NUMBER() OVER ( ORDER BY [R].[id] ) AS [rowNum], 
	[R].[id], [R].[subsections], [R].[element], 
	[R].[Discriminator], [R].[authorId], [R].[status], 
	[R].[label], [R].[tags], [R].[dateCreated], [R].[dateLastModified], 
	[R].[attributesId], [R].[dataId], [R].[metaId], 
	[R].[shared], [R].[isPublic]
	FROM [R]
) AS [RowConstrainedResult]
WHERE [rowNum] >= @rowStart AND [RowNum] < @rowEnd

ORDER BY [rowNum]
END