/** Returns a collection of tags (FormPosts)
	SELECT TOP 5 * FROM [FORMPOST].[Tags]
*/
ALTER VIEW [FORMPOST].[Tags] --WITH SCHEMABINDING 
AS 
	SELECT 
		[id], 
		--[formId],
		[xmlResults].query('root/tag').value('/', 'VARCHAR(128)') AS [tag],
		[dateCreated], 
		[dateLastModified],
		--[version], 
		[authorId], 
		[xmlResults], 
		[jsonResults],
		[shared]
	FROM [ICARUS].[FormPosts]
	WHERE [formId] = 10128
GO


