/**	Return a Paginated List of Image Indices
	EXEC [FORMPOST].[GetImageList] 'ryan@spoonmedia.ca', 5, 0
	EXEC [FORMPOST].[GetImageList] 'ryan@spoonmedia.ca', 5, 1
*/
ALTER PROCEDURE [FORMPOST].[GetImageList] 
	@authorId NVARCHAR(128),
	@pageLength INT = 5,
	@page INT = 0
AS BEGIN

DECLARE @rowStart INT = (@pageLength * @page) + 1;
DECLARE @rowEnd INT = @rowStart + @pageLength;

SELECT 
	--[rowNum] - 1 AS [index], 
	*
 
FROM ( 
	SELECT ROW_NUMBER() OVER ( ORDER BY [id] ) AS [rowNum], *
    FROM [FORMPOST].[Images]
    WHERE ([authorId] = @authorId OR [shared] = 1)	
) AS [RowConstrainedResult]
WHERE [rowNum] >= @rowStart AND [RowNum] < @rowEnd
ORDER BY [rowNum]

END 
GO