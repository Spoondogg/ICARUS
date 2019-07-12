/** Retrieves a list of CONTAINER(s) that are available to the user
	SELECT TOP 10 * FROM [CONTAINER].[tvf_GetAvailableByLabel]('ryan@spoonmedia.ca', 'MAIN')
	SELECT TOP 10 * FROM [CONTAINER].[tvf_GetAvailableByLabel]('ryan@spoonmedia.ca', '*', 'woot')
*/
CREATE FUNCTION [CONTAINER].[tvf_GetAvailableByLabel] (
	@authorId NVARCHAR(128),
	@discriminator NVARCHAR(256),
	@label NVARCHAR(256)
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
FROM [CONTAINER].[tvf_GetAvailableByDiscriminator](@authorId, @discriminator)
WHERE ([label] = @label OR @label = '*')