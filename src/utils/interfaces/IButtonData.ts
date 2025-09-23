import Categories from "../enums/Categories";

export default interface ICommandData {
    name: string;
    description: string;
    default_member_permissions: bigint;
    custom: boolean;
    owner: boolean;
    dm_permission: boolean;
    category: Categories;
}
