/** Retrieves FormPosts of the given formId type that contain the 
	given key/value queryString pattern
	SELECT * FROM [FORMPOST].[tvf_SearchByFormId]('ryan@spoonmedia.ca', 0, 'name', 'woot')
	SELECT * FROM [FORMPOST].[tvf_SearchByFormId]('ryan@spoonmedia.ca', 10128, 'tag', 'd')
	SELECT * FROM [FORMPOST].[tvf_SearchByFormId]('ryan@spoonmedia.ca', 3, 'filename', 'doge')
*/
ALTER FUNCTION [FORMPOST].[tvf_SearchByFormId](
	@authorId NVARCHAR(128),
	@formId INT,
	@key NVARCHAR(256),
	@contains NVARCHAR(64) = ''
) RETURNS TABLE AS RETURN 
	SELECT
		[id], [formId], [authorId], [status], 
		[dateCreated], [dateLastModified], 
		[shared], [isPublic], 
		[xmlResults],
		[jsonResults],
		[xmlResults].query('root/*[local-name()=sql:variable("@key")]').value('/', 'VARCHAR(128)') AS [result]
	FROM [FORMPOST].[tvf_GetAvailableByFormId](@authorId, @formId)
	WHERE (
		(
			[xmlResults].query('root/*[local-name()=sql:variable("@key")]').value('/', 'VARCHAR(128)') LIKE '%' + @contains + '%'
			AND LEN(@contains) > 0 
		) 
		OR @contains = ''
	)