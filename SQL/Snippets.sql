USE [ICARUS];
DECLARE @id VARCHAR(8) = 3138

SELECT *
FROM [ICARUS].[Containers]
WHERE [id] = @id

SELECT * FROM [ICARUS].[Containers]
WHERE [subsections] LIKE '%' + @id + '%'

/*
DELETE FROM [ICARUS].[Containers]
WHERE [id] = 3539
*/

SELECT * FROM [ICARUS].[Containers]
WHERE [Discriminator] = 'Main'
AND [subsections] = '0'

SELECT * FROM [ICARUS].[FormPosts] WHERE [id] in (3,239,261)

SELECT TOP 100 *
FROM [ICARUS].[FormPosts]
WHERE [formId] != 0
ORDER BY [id] DESC