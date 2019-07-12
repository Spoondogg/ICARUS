/** Retrieves a list of Containers that match on the given tag(s)
	EXEC [CONTAINER].[SearchByTag] 'ryan@spoonmedia.ca', '*', 'woot,idea'
*/
DECLARE @authorId NVARCHAR(128) = 'ryan@spoonmedia.ca';
DECLARE @discriminator NVARCHAR(128) = '*';
DECLARE @tag NVARCHAR(256) = 'woot,idea';

WITH [Q] AS (
	SELECT [data] AS [tag] FROM [dbo].[split](@tag,',')
)
--SELECT * FROM [Q]
--SELECT * FROM [ICARUS].[FORMPOST].[Tags]
SELECT DISTINCT
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
FROM [FORMPOST].[Tags] AS [T]
CROSS APPLY [CONTAINER].[tvf_SearchByTagId](@authorId, @discriminator, [T].[id]) AS [C]
--WHERE [T].[tag] = @tag
WHERE [T].[tag] IN (
	SELECT [tag] FROM [Q]
)


/*UPDATE [ICARUS].[Containers]
SET [tags] = '14449,14577'
WHERE [id] = 1*/