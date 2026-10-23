function execute()
	local order = LuaGetCombatCurrentCharacterOrder()
	local atk = LuaCombatGetCharacterStat( order, STAT_ATK )
	atk = (atk * 2) + 1500
	LuaCombatPlayerAttack( atk )
end