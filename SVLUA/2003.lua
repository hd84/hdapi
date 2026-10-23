function execute()
	local order = LuaGetCombatCurrentCharacterOrder()
	local atk = LuaCombatGetCharacterStat( order, STAT_ATK )
	LuaCombatPlayerAddCritical( 1000 )
	LuaCombatPlayerAttack( atk )
end