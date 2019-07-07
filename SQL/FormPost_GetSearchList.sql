/**	Return a Paginated List of FormPosts that match the given query
	EXEC [ICARUS].[GetSearchList_FormPost] 'ryan@spoonmedia.ca', '10128', 20, 0, 'tag:w,tag:b'
	http://localhost:8052/FORM/search/?page=0&pageLength=10&query=im
*/
ALTER PROCEDURE [ICARUS].[GetSearchList_FormPost] 
	@authorId NVARCHAR(128),
	@formId INT = 10128, -- tags
	@pageLength INT = 5,
	@page INT = 0,
	@query NVARCHAR(128) = '' -- ie: null or tag:woot,name:snoot (comma delimited key:value)
AS BEGIN

DECLARE @rowStart INT = (@pageLength * @page) + 1;
DECLARE @rowEnd INT = @rowStart + @pageLength;

-- FILTER(S)
WITH [F1] AS (
	SELECT [split].[id], [split].[data],
	CHARINDEX(':', [split].[data]) AS [splitter]
	FROM [dbo].[split](@query, ',') AS [split]
), [F2] AS (
	SELECT 
		[F1].[id], 
		SUBSTRING([F1].[data], 0, [F1].[splitter]) AS [key],
		SUBSTRING([F1].[data], [F1].[splitter] + 1, LEN([F1].[data])) AS [value]
	FROM [F1]
)
SELECT 
	[rowNum] - 1 AS [index], [id], [formId], 
	[authorId], [status], 
	[dateCreated], [dateLastModified], 
	[shared], [isPublic],
	[xmlResults], [jsonResults]
 
FROM ( 
	SELECT ROW_NUMBER() OVER ( ORDER BY [F2].[id] ) AS [rowNum], 
	[RESULT].[id], [RESULT].[formId], [RESULT].[authorId], [RESULT].[status], 
	[RESULT].[dateCreated], [RESULT].[dateLastModified], 
	[RESULT].[shared], [RESULT].[isPublic],
	[RESULT].[xmlResults], 
	[RESULT].[jsonResults]
    FROM [F2]
	CROSS APPLY [ICARUS].[tvf_SearchFormPostById](@authorId, @formId, [F2].[key], [F2].[value]) AS [RESULT]
) AS [RowConstrainedResult]
WHERE [rowNum] >= @rowStart AND [RowNum] < @rowEnd

ORDER BY [rowNum]

END 
