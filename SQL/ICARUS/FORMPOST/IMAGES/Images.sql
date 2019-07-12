/**	Returns a collection of images (FormPosts) 
	SELECT TOP 100 * FROM [FORMPOST].[Images]
*/
ALTER VIEW [FORMPOST].[Images] --WITH SCHEMABINDING 
AS 
	SELECT 
		[id], 
		--[formId], 
		[authorId], 
		[shared],
		[isPublic],
		[status],
		[dateCreated], 
		[dateLastModified],
		--[xmlResults].query('root/filename').value('/', 'VARCHAR(128)') AS [fileName],
		[xmlResults], 
		[jsonResults]
		
	FROM [ICARUS].[FormPosts]
	WHERE [formId] = 3
GO


