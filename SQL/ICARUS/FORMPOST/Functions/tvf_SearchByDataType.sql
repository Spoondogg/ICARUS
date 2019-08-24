/** Retrieves FormPosts of the given dataType(s) that contain the given key/value queryString pattern (formId = 0)
	SELECT * FROM [FORMPOST].[tvf_SearchByDataType]('ryan@spoonmedia.ca', 'shared', '1')
	SELECT * FROM [FORMPOST].[tvf_SearchByDataType]('ryan@spoonmedia.ca', 'filename', 'dog')
*/
ALTER FUNCTION [FORMPOST].[tvf_SearchByDataType](
	@authorId NVARCHAR(128),
	@key NVARCHAR(256),
	@contains NVARCHAR(64)
) RETURNS TABLE AS RETURN 
	SELECT 
		[id], [formId], 
		[authorId], [status], 
		[dateCreated], [dateLastModified], 
		[shared], [isPublic], 
		[xmlResults], 
		[jsonResults],
		[xmlResults].query('root/*[local-name()=sql:variable("@key")]').value('/', 'VARCHAR(128)') AS [result]
	FROM [FORMPOST].[tvf_GetAvailableByFormId](@authorId, 0)
	WHERE ((
		[xmlResults].query('root/*[local-name()=sql:variable("@key")]').value('/', 'VARCHAR(128)') LIKE '%' + @contains + '%'
		AND LEN(@contains) > 0 
	) OR @contains = '')