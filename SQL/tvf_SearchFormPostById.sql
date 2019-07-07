/** Retrieves FormPosts of the given formId type that contain the 
	given key/value queryString pattern
	SELECT * FROM [ICARUS].[tvf_SearchFormPostById]('ryan@spoonmedia.ca', 10128, 'tag', '')
	SELECT * FROM [ICARUS].[tvf_SearchFormPostById]('ryan@spoonmedia.ca', 10128, 'tag', 'b')
*/
ALTER FUNCTION [ICARUS].[tvf_SearchFormPostById](
	@authorId NVARCHAR(128),
	@formId INT,
	@key NVARCHAR(256),
	@contains NVARCHAR(64)
) RETURNS TABLE AS RETURN 
	SELECT --TOP 100 
		[id], [formId], [authorId], [status], 
		[dateCreated], [dateLastModified], 
		[shared], [isPublic], 
		[xmlResults],
		[jsonResults],
		[xmlResults].query('root/*[local-name()=sql:variable("@key")]').value('/', 'VARCHAR(128)') AS [result]
	FROM [ICARUS].[FormPosts]
	WHERE [formId] = @formId AND @formId != 0
	AND [status] != -1
	AND	([authorId] = @authorId OR [shared] = 1 OR [isPublic] = 1)
	AND ((
		[xmlResults].query('root/*[local-name()=sql:variable("@key")]').value('/', 'VARCHAR(128)') LIKE '%' + @contains + '%'
		AND LEN(@contains) > 0 
	) OR @contains = '')