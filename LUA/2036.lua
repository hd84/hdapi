function execute()
	local order = LuaGetCombatFriendCharacterOrder()
	LuaCombatCharacterAddChargingTime( order, -10000 )

	order = LuaGetCombatCurrentCharacterOrder()
	local atk = LuaCombatGetCharacterStat( order, STAT_ATK )	
	LuaCombatPlayerAttack( atk * 2 )
end