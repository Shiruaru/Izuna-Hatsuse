import Categories from "../enums/Categories";
import ICommandOptions from "./ICommandOptions";

export default interface ICommandData {
    name: string;
    description: string;
    default_member_permissions: bigint;
    custom: boolean;
    owner: boolean;
    dm_permission: boolean;
    category: Categories;
    options: ICommandOptions[];
}
