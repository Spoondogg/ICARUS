/**	Return a Paginated List of Images
	EXEC [FORMPOST].[GetImageIndex] 'ryan@spoonmedia.ca', 5, 0
*/
ALTER PROCEDURE [FORMPOST].[GetImageIndex] 
	@authorId NVARCHAR(128),
	@pageLength INT = 5,
	@page INT = 0
AS BEGIN

DECLARE @rowStart INT = (@pageLength * @page) + 1;
DECLARE @rowEnd INT = @rowStart + @pageLength;

SELECT 
	[rowNum] - 1 AS [index], [id], 'FormPost' AS [label]
 
FROM ( 
	SELECT ROW_NUMBER() OVER ( ORDER BY [id] ) AS [rowNum], *
    FROM [FORMPOST].[Images]
    WHERE ([authorId] = @authorId OR [shared] = 1)	
) AS [RowConstrainedResult]
WHERE [rowNum] >= @rowStart AND [RowNum] < @rowEnd
ORDER BY [rowNum]

END 
GO