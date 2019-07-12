/**
	Extract data from Chat conversations and append to the Dictionary
	-- formId 1 comes from a Chat and should be analyzed for vocabulary
*/
USE [ICARUS];
SELECT TOP 5
	[id], [formId], --[xmlResults],
	[xmlResults].query('root/statement') AS [statementNode],
	--[xmlResults].query('(root/*)[2]').value('/','int') AS [WordCount],
	[xmlResults].query('root/statement').value('/','varchar(100)') AS [statement]
FROM [ICARUS].[FormPosts]
WHERE [formId] = 1 
ORDER BY [id] DESC

