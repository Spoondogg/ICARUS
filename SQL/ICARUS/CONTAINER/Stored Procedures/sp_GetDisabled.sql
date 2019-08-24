/**	Retrieve inactive Containers
	These should be deleted within X days of being set to status "-1"
*/
USE [ICARUS];
SELECT *
FROM [ICARUS].[Containers]
WHERE [status] = -1
ORDER BY [id] DESC
