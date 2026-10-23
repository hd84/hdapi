function execute()
	local order = LuaGetCombatCurrentCharacterOrder()
	local atk = LuaCombatGetCharacterStat( order, STAT_ATK )	
	atk = atk * 70 / 100
	LuaCombatPlayerAttack( atk )
end