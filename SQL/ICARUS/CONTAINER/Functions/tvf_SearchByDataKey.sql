/** Retrieves FormPosts of the given dataType(s) that contain the given key/value queryString pattern (formId = 0)
	SELECT * FROM [CONTAINER].[tvf_SearchByDataKey]('ryan@spoonmedia.ca', '*', 'isPublic', '-1') -- Protect against this!!!
*/
ALTER FUNCTION [CONTAINER].[tvf_SearchByDataKey](
	@authorId NVARCHAR(128),
	@discriminator NVARCHAR(256),
	@key NVARCHAR(256),
	@contains NVARCHAR(64)
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
		[C].[tags]
	FROM [CONTAINER].[tvf_GetAvailableByDiscriminator](@authorId, @discriminator) AS [C]
	LEFT JOIN [FORMPOST].[tvf_GetAvailableByFormId](@authorId, 0) AS [D] ON ([C].[dataId] = [D].[id])
	WHERE ((
		[xmlResults].query('root/*[local-name()=sql:variable("@key")]').value('/', 'VARCHAR(256)') LIKE '%' + @contains + '%'		
		AND LEN(@contains) > 0 
	) OR @contains = '')