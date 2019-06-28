/**	Return a Paginated List of Containers
	EXEC [ICARUS].[GetIndex] 'ryan@spoonmedia.ca', 'Article', 5, 0
*/
ALTER PROCEDURE [ICARUS].[GetIndex] 
	@authorId NVARCHAR(128),
	@discriminator NVARCHAR(128),
	@pageLength INT = 5,
	@page INT = 0
AS BEGIN

DECLARE @rowStart INT = (@pageLength * @page) + 1;
DECLARE @rowEnd INT = @rowStart + @pageLength;

SELECT 
	[rowNum] - 1 AS [index], [id], [label]
 
FROM ( 
	SELECT ROW_NUMBER() OVER ( ORDER BY [id] ) AS [rowNum], *
    FROM [ICARUS].[Containers]
    WHERE [Discriminator] = @discriminator
	AND [status] != -1
	AND	([authorId] = @authorId OR [shared] = 1)	
) AS [RowConstrainedResult]
WHERE [rowNum] >= @rowStart AND [RowNum] < @rowEnd
ORDER BY [rowNum]

END 
GO