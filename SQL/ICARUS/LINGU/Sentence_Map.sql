/**
	Maps the words in the given sentence to their corresponding word Ids
	SELECT * FROM [LINGU].[MapWords](1204)
*/
ALTER FUNCTION [LINGU].[MapWords](
	@sentenceId INT
) RETURNS TABLE AS RETURN 
	SELECT
		[WORD].[id] AS [ordinal],
		[LINGU].[Dictionary].[id],
		[WORD].[data] AS [word]
	FROM [LINGU].[Sentences]
	CROSS APPLY [dbo].[split]([Sentences].[sentence],' ') AS [WORD]
	LEFT JOIN [LINGU].[Dictionary] ON (
		[WORD].[data] = [LINGU].[Dictionary].[word]
	)
	WHERE [Sentences].[id] = @sentenceId