/** Retrieves a list of FormPosts used in Container Models (data, attr, meta)
	EXEC [FORMPOST].[GetAvailableByDataType] 'ryan@spoonmedia.ca', 'MAIN', 'dataId', 5, 0, 'shared:-1'
	EXEC [FORMPOST].[GetAvailableByDataType] 'guest@spoonmedia.ca', 'ARTICLE', 'dataId,attributesId,metaId'
	EXEC [FORMPOST].[GetAvailableByDataType] 'ryan@spoonmedia.ca', 'MAIN', 'metaId', 50, 0, 'description:lorem'
*/
ALTER PROCEDURE [FORMPOST].[GetAvailableByDataType]
	@authorId NVARCHAR(128),
	@discriminator NVARCHAR(256) = 'MAIN',
	@dataType NVARCHAR(256) = 'dataId,attributesId,metaId',
	@pageLength INT = 5,
	@page INT = 0,
	@query NVARCHAR(128) = '' -- ie: null or tag:woot,name:snoot (comma delimited key:value)
AS BEGIN 

DECLARE @rowStart INT = (@pageLength * @page) + 1;
DECLARE @rowEnd INT = @rowStart + @pageLength;

SELECT 
	[rowNum] - 1 AS [index], --[id], 
	[postId] AS [id],
	[postType] AS [type],
	[authorId], [status], 
	[dateCreated], [dateLastModified], 
	[shared], [isPublic],
	[key], [value],
	[xmlResults], [jsonResults]
 
FROM ( 
	SELECT ROW_NUMBER() OVER ( ORDER BY [FP].[id] ) AS [rowNum], 
		[F].[postType], 
		[F].[postId],
		[FP].[formId], [FP].[authorId], [FP].[status], 
		[FP].[dateCreated], [FP].[dateLastModified], 
		[FP].[shared], [FP].[isPublic],
		[Q].[key], [Q].[value],
		[FP].[xmlResults], 
		[FP].[jsonResults]
	FROM [STRING].[tvf_ParseSearchString](@query) AS [Q]
	CROSS APPLY [FORMPOST].[tvf_GetAvailableByDataType](@authorId, @discriminator, @dataType) [F]
	LEFT JOIN [ICARUS].[FormPosts] AS [FP] ON (
		[F].[postId] = [FP].[id]
	)
) AS [RowConstrainedResult]
WHERE [rowNum] >= @rowStart AND [RowNum] < @rowEnd

END