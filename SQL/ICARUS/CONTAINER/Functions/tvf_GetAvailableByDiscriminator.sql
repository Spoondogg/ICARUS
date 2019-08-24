/** Retrieves a list of CONTAINER(s) that are available to the user
	SELECT TOP 10 * FROM [CONTAINER].[tvf_GetAvailableByDiscriminator]('ryan@spoonmedia.ca', 'MAIN')
	SELECT TOP 10 * FROM [CONTAINER].[tvf_GetAvailableByDiscriminator]('ryan@spoonmedia.ca', '*')
*/
ALTER FUNCTION [CONTAINER].[tvf_GetAvailableByDiscriminator] (
	@authorId NVARCHAR(128),
	@discriminator NVARCHAR(256)
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
WHERE ([Discriminator] = @discriminator OR @Discriminator = '*')
AND [status] != -1
AND	([authorId] = @authorId OR [shared] = 1 OR [isPublic] = 1)