/** Retrieve FormPosts of the specified type for a given Container Type
	@returns A list of UIds that match the type and discriminator
	EXEC [ICARUS].[GetContainerFormPosts] 'ryan@spoonmedia.ca', 'MAIN', 'data'
	EXEC [ICARUS].[GetContainerFormPosts] 'ryan@spoonmedia.ca', 'MAIN', 'attributes'
	EXEC [ICARUS].[GetContainerFormPosts] 'ryan@spoonmedia.ca', 'MAIN', 'meta'
	-- Sanitize in SQL or Sanitize in C#?  C# is a little cleaner to work with and 
	-- doesn't bog down the query optimizer
*/
ALTER PROCEDURE [ICARUS].[GetContainerFormPosts]
	@authorId NVARCHAR(128),
	@discriminator NVARCHAR(64) = 'MAIN',
	@type NVARCHAR(12) = 'data', -- data, attributes, meta,
	@pageLength INT = 5,
	@page INT = 0,
	@query NVARCHAR(128) = null
AS BEGIN

DECLARE @rowStart INT = (@pageLength * @page) + 1;
DECLARE @rowEnd INT = @rowStart + @pageLength;
DECLARE @querystring NVARCHAR(256) = 
	'SELECT DISTINCT [' + @type + 'Id] AS [id] ' + 
	'FROM [ICARUS].[Containers] ' + 
	'WHERE [Discriminator] = ''' + @discriminator + ''' ' +
	'AND [' + @type + 'Id] != 0 ' +
	'AND [status] != -1 ' +
	'AND ( ' +
	'	[authorId] = ''' + @authorId + ''' ' +
	'	OR [shared] = 1 ' +
	'	OR [isPublic] = 1 ' +
	')';


EXEC sp_executesql @querystring;

END