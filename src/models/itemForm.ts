import {OptionsGender} from "./optionsGender.ts";
import {OptionsStatus} from "./optionsStatus.ts";

export interface ItemForm {
    name: string
    label: string
    placeholder: string
    genders?: OptionsGender[];
    status?: OptionsStatus[];
    typeInput: string;
}