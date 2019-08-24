/** Return a list of tag(s) that are available to the user, 
	matching on/or beginning with the given query value
	EXEC [FORMPOST].[GetTags] 'ryan@spoonmedia.ca', 'w';
*/
ALTER PROCEDURE [FORMPOST].[GetTags]
	@authorId NVARCHAR(128),
	@query NVARCHAR(64)
AS BEGIN 
	SELECT TOP (10) 
		[id],
		[tag],
		[dateCreated],
		[dateLastModified],
		[authorId],
		[xmlResults],
		[jsonResults],
		[shared]
	FROM [FORMPOST].[Tags]
	WHERE [tag] LIKE @query + '%'
	AND ([authorId] = @authorId OR [shared] = 1)
	ORDER BY [tag] ASC
END