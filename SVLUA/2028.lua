function execute()
	local order = LuaGetCombatCurrentCharacterOrder()
	local atk = LuaCombatGetCharacterStat( order, STAT_ATK )	
	LuaCombatPlayerAttack( atk )

	order = LuaGetCombatFriendCharacterOrder()
	local atk2 = LuaCombatGetCharacterStat( order, STAT_ATK )	
	LuaCombatMonsterAddStat( STAT_ATK, -atk2 )
end