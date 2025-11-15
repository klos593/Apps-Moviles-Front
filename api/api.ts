import { ProfessionalCardData } from "@/components/Types/ProfessionalCardData";
import { ProfessionalData } from "@/components/Types/ProfessionalData";
import { ProfessionCardData } from "@/components/Types/ProfessionCardData";
import ServiceCardData from "@/components/Types/ServiceCardData";
import { ServiceData } from "@/components/Types/ServiceData";
import { UserData } from "@/components/Types/UserData";
import { URL } from "./url";


export async function getProfessionals(): Promise<ProfessionalCardData[]> {
    const response = await fetch(`${URL}/professionals`);
    return response.json();
}

export async function getProfessions(): Promise<ProfessionCardData[]> {
    const response = await fetch(`${URL}/professions`);
    return response.json();
}

export async function getProfessionalProfessions(id: string): Promise<ProfessionCardData[]> {
    const response = await fetch(`${URL}/professionalProfessions/${encodeURIComponent(id)}`)
    return response.json()
}

export async function getProfessionalWithId(id: string): Promise<ProfessionalData> {
    const response = await fetch(`${URL}/professional/${encodeURIComponent(id)}`);
    return response.json();
}

export async function getUser(email: string): Promise<UserData> {

    const response = await fetch(`${URL}/user/${encodeURIComponent(email)}`);
    return response.json();
}

export async function getProfessionalsWithProfession(profession: string): Promise<ProfessionalCardData[]> {
    const response = await fetch(`${URL}/professionals/${encodeURIComponent(profession)}`);
    return response.json();
}


export async function updateUser(email: string, body: { name: string; lastName: string; phone: string; street: string, number: number, floor: string, province: string, country: string, description: string }): Promise<UserData> {
    const res = await fetch(`${URL}/user/${encodeURIComponent(email)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("No se pudo actualizar");
    return res.json();
}

export async function getFinishedUsedServices(email: string): Promise<ServiceCardData[]> {
    const response = await fetch(`${URL}/finishedUsedServices/${encodeURIComponent(email)}`);
    return response.json();
}

export async function getFinishedProvidedServices(email: string): Promise<ServiceCardData[]> {
    const response = await fetch(`${URL}/finishedProvidedServices/${encodeURIComponent(email)}`);
    return response.json();
}

export async function getUserActiveServices(email: string): Promise<ServiceCardData[]> {
    const response = await fetch(`${URL}/userActiveServices/${encodeURIComponent(email)}`);
    return response.json();
}

export async function getProviderActiveServices(email: string): Promise<ServiceCardData[]> {
    const response = await fetch(`${URL}/providerActiveServices/${encodeURIComponent(email)}`);
    return response.json();
}

export async function  createService(serviceData: ServiceData) {
  const response = await fetch(`${URL}/createService`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(serviceData),
  });

  if (!response.ok) {
    throw new Error('Error al crear el servicio');
  }

  return response.json();
};

export async function getUserIdAndAddressId(email: string): Promise<{userId: number, addressId: number}>{
    const response = await fetch(`${URL}/userIdAndAddress/${encodeURIComponent(email)}`);
    return response.json();
}