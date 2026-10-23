function execute()
	order = LuaGetCombatCurrentCharacterOrder()		
	LuaCombatCharacterAddStatPercent( order, STAT_HEAL, 100 )
	local order = LuaGetCombatFriendCharacterOrder()		
	LuaCombatCharacterAddStatPercent( order, STAT_HEAL, 100 )
end