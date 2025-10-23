import { ProfessionalCardData } from "@/components/Types/ProfessionalCardData";
import { ProfessionalData } from "@/components/Types/ProfessionalData";
import { ProfessionCardData } from "@/components/Types/ProfessionCardData";
import { URL } from "./url";


export async function getProfessionals(): Promise<ProfessionalCardData[]> {
    const response = await fetch(`${URL}/professionals`);
    return response.json();
}

export async function getProfessions(): Promise<ProfessionCardData[]> {
    const response = await fetch(`${URL}/professions`);
    return response.json();
}

export async function getProfessionalWithId(id: string): Promise<ProfessionalData>{
    const response = await fetch(`${URL}/professional/${id}`);
    return response.json();
}

export async function getProfessionalsWithProfession(profession: string): Promise<ProfessionalCardData[]> {
    const response = await fetch(`${URL}/professionals/${profession}`);
    return response.json();
}