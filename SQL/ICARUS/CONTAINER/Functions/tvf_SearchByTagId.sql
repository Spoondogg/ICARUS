/** Retrieves FormPosts of the given dataType(s) that contain the given key/value queryString pattern (formId = 0)
	SELECT * FROM [CONTAINER].[tvf_SearchByTagId]('ryan@spoonmedia.ca', 'MAIN', 14449) -- Protect against this!!!
	SELECT * FROM [CONTAINER].[tvf_SearchByTagId]('ryan@spoonmedia.ca', 'FORM', 14449) -- Protect against this!!!
	SELECT * FROM [CONTAINER].[tvf_SearchByTagId]('ryan@spoonmedia.ca', '*', 14449) -- Protect against this!!!
*/
ALTER FUNCTION [CONTAINER].[tvf_SearchByTagId](
	@authorId NVARCHAR(128),
	@discriminator NVARCHAR(256),
	@tagId INT
) RETURNS TABLE AS RETURN 
	SELECT 
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
		[C].[tags],
		[T].[id] AS [tagIndex],
		[T].[data] AS [tag]
	FROM [CONTAINER].[tvf_GetAvailableByDiscriminator](@authorId, @discriminator) AS [C]
	CROSS APPLY [dbo].[split]([C].[tags],',') AS [T]
	WHERE LEN([C].[tags]) > 0 AND [C].[tags] != '0'
	AND [T].[data] = @tagId