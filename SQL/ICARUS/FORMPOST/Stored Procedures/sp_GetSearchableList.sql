/**	Return a Paginated List of FormPosts that match the given query
	EXEC [FORMPOST].[GetSearchableList] 'ryan@spoonmedia.ca', '10128', 20, 0, 'tag:w,tag:b'
	EXEC [FORMPOST].[GetSearchableList] 'ryan@spoonmedia.ca', '9842', 200, 0, 'ComplaintType:w,complaintDetails:d'
	EXEC [FORMPOST].[GetSearchableList] 'ryan@spoonmedia.ca', '3', 20, 0, 'filename:doge'
	http://localhost:8052/FORM/search/?page=0&pageLength=10&query=im
*/
ALTER PROCEDURE [FORMPOST].[GetSearchableList] 
	@authorId NVARCHAR(128),
	@formId INT,
	@pageLength INT = 5,
	@page INT = 0,
	@query NVARCHAR(128) = '' -- ie: null or tag:woot,name:snoot (comma delimited key:value)
AS BEGIN

DECLARE @rowStart INT = (@pageLength * @page) + 1;
DECLARE @rowEnd INT = @rowStart + @pageLength;

SELECT 
	[rowNum] - 1 AS [index], [id], [formId], 
	[authorId], [status], 
	[dateCreated], [dateLastModified], 
	[shared], [isPublic],
	[key], [value],
	[xmlResults], [jsonResults]
 
FROM ( 
	SELECT ROW_NUMBER() OVER ( ORDER BY [F2].[id] ) AS [rowNum], 
	[RESULT].[id], [RESULT].[formId], [RESULT].[authorId], [RESULT].[status], 
	[RESULT].[dateCreated], [RESULT].[dateLastModified], 
	[RESULT].[shared], [RESULT].[isPublic],
	[F2].[key], [F2].[value],
	[RESULT].[xmlResults], 
	[RESULT].[jsonResults]
    FROM [STRING].[tvf_ParseSearchString](@query) AS [F2]
	CROSS APPLY [FORMPOST].[tvf_SearchByFormId](@authorId, @formId, [F2].[key], [F2].[value]) AS [RESULT]
) AS [RowConstrainedResult]
WHERE [rowNum] >= @rowStart AND [RowNum] < @rowEnd

ORDER BY [rowNum]

END 
