/** Retrieves a list of CONTAINER(s) that are available to the user
	SELECT TOP 10 * FROM [FORMPOST].[tvf_GetAvailableByFormId]('ryan@spoonmedia.ca', 0)
	SELECT TOP 10 * FROM [FORMPOST].[tvf_GetAvailableByFormId]('ryan@spoonmedia.ca', 3)
	SELECT TOP 10 * FROM [FORMPOST].[tvf_GetAvailableByFormId]('ryan@spoonmedia.ca', 10128)
*/
ALTER FUNCTION [FORMPOST].[tvf_GetAvailableByFormId] (
	@authorId NVARCHAR(128),
	@formId INT
) RETURNS TABLE AS RETURN 
SELECT 
	[id],
    [formId],
    [authorId],
    [shared],
    [isPublic],
    [status],
    [dateCreated],
    [dateLastModified],
    [xmlResults],
    [jsonResults]
FROM [ICARUS].[FormPosts]
WHERE [formId] = @formId
AND [status] != -1
AND	([authorId] = @authorId OR [shared] = 1 OR [isPublic] = 1)