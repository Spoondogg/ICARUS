/**
	Returns a comma delimited list of Word Id's that are used in the 
	given Sentence
	SELECT * FROM [ICARUS].[GetWordIdList_TVF](1204);
*/
ALTER FUNCTION [LINGU].[GetWordIdList_TVF](
	@sentenceId INT
) RETURNS TABLE AS RETURN (
	SELECT STUFF(
		(
			SELECT N',' + CAST([id] AS VARCHAR(8))
			FROM [LINGU].[MapWords](1204) FOR XML PATH(''),TYPE
		).value('text()[1]','nvarchar(max)')
		,1,1,N''
	) AS [wordIdList]
)