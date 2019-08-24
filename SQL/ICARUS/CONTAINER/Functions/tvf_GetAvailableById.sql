/** Retrieves a list of CONTAINER(s) that are available to the user
	SELECT TOP 10 * FROM [CONTAINER].[tvf_GetAvailableById]('ryan@spoonmedia.ca', 1)
	SELECT TOP 10 * FROM [CONTAINER].[tvf_GetAvailableById]('ryan@spoonmedia.ca', 10128)
*/
ALTER FUNCTION [CONTAINER].[tvf_GetAvailableById] (
	@authorId NVARCHAR(128),
	@id INT
) RETURNS TABLE AS RETURN 
SELECT 
	[id],
    [subsections],
    [element],
    [label],
    [Discriminator],
    [authorId],
    [status],
    [shared],
    [isPublic],
    [dateCreated],
    [dateLastModified],
    [attributesId],
    [dataId],
    [metaId],
    [tags]
FROM [ICARUS].[Containers]
WHERE ([id] = @id)
AND [status] != -1
AND	([authorId] = @authorId OR [shared] = 1 OR [isPublic] = 1)