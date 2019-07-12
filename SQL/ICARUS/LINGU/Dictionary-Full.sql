/**
	Contains a list of ALL words including duplicates that exist 
	from Chat (form id 2) entries.
*/
ALTER VIEW [LINGU].[Dictionary-Full] WITH SCHEMABINDING AS 
	SELECT [id], [LINGU].[GetWord]([xmlResults]) AS [word]
	FROM [ICARUS].[FormPosts]
	WHERE [formId] = 2