export default interface ISecurity {
	id: string,
	status: boolean,
	modRoleList: string[]
	adminRoleList: string[]
	anouncerRoleList: string[],
	anounceRestrict: boolean
}
