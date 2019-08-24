/**
	Returns a list of Sentences and their attributes
*/
ALTER VIEW [LINGU].[Sentences] --WITH SCHEMABINDING 
AS 
	SELECT 
		[id], [formId], [dateCreated], [version], [authorId], 
		[xmlResults], [jsonResults], [shared],
		[LINGU].[GetStatement]([xmlResults]) AS [sentence]
	FROM [ICARUS].[FormPosts]
	WHERE [formId] = 1