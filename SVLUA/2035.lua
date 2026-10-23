function execute()
	local order = LuaGetCombatFriendCharacterOrder()
	LuaCombatCharacterAddChargingTime( order, -5000 )
end