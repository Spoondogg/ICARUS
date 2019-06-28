/** Test xml query */
DECLARE @query NVARCHAR(128) = 'er'
USE [ICARUS];
WITH [Posts] AS (
	SELECT [id]
		  [formId],
		  --,[authorId]
		  --,[shared]
		  --,[isPublic]
		  --,[status]
		  --,[dateCreated]
		  --,[dateLastModified]
		  --,[xmlResults]
		  --,[jsonResults]
		  --,[xmlResults].value('(description/text())[1]', 'varchar(256)') as [Desc]
		  [xmlResults].query('root/description').value('/', 'VARCHAR(128)') AS [Desc],
		  [xmlResults].query('root/tags').value('/', 'VARCHAR(128)') AS [tags]

	FROM [ICARUS].[FormPosts]
)
SELECT * FROM [POSTS] 
--WHERE [Desc] != ''
WHERE [POSTS].[Desc] LIKE '%' + @query + '%'
