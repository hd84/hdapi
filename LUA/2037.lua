function execute()
	local randValue = LuaRandom( 1, 50 )
	randValue = randValue * 10

	LuaCombatMonsterAddStatPercent( STAT_ATK, randValue)
end