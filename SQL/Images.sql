/**
	Returns a collection of images (FormPosts)
*/
ALTER VIEW [ICARUS].[Images] --WITH SCHEMABINDING 
AS 
	SELECT 
		[id], 
		--[formId], 
		--[label],
		--[xmlResults].query('root/filename').value('/', 'VARCHAR(128)') AS [fileName],
		[dateCreated], 
		[dateLastModified],
		--[version], 
		[authorId], 
		[xmlResults], 
		[jsonResults],
		[shared]
	FROM [ICARUS].[FormPosts]
	WHERE [formId] = 3
GO


