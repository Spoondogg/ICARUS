/**	Retrieves a list of FormPosts used in Containers via Unpivot
	SELECT * FROM [FORMPOST].[tvf_GetAvailableByDataType]('ryan@spoonmedia.ca', 'MAIN', 'dataId,attributesId,metaId')
	SELECT * FROM [FORMPOST].[tvf_GetAvailableByDataType]('ryan@spoonmedia.ca', 'MAIN', 'dataId,metaId')
	SELECT * FROM [FORMPOST].[tvf_GetAvailableByDataType]('ryan@spoonmedia.ca', 'MAIN', 'dataId')
*/
ALTER FUNCTION [FORMPOST].[tvf_GetAvailableByDataType] (
	@authorId NVARCHAR(128),
	@discriminator NVARCHAR(256),
	@dataType NVARCHAR(256) = 'dataId,attributesId,metaId'
) RETURNS TABLE AS RETURN 
WITH [TYPES] AS (
	SELECT [data] 
	FROM [dbo].[split](@dataType,',')
)
SELECT 
	[UNPVT].[id], 
	--[UNPVT].[Discriminator], 
	[UNPVT].[postType], [UNPVT].[postId]
FROM (
	SELECT 
		[id], --[Discriminator], 
		[dataId], [attributesId], [metaId]
	FROM [CONTAINER].[tvf_GetAvailableByDiscriminator](@authorId, @discriminator)
) AS [P]
UNPIVOT ([postId] FOR [postType] IN (
	[dataId], [metaId], [attributesId]
)) AS [UNPVT]
WHERE [postId] != 0 
AND [postType] IN (
	SELECT [data] FROM [TYPES]
)