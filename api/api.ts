import { ProfessionalCardData } from "@/components/Types/ProfessionalCardData";
import { ProfessionalData } from "@/components/Types/ProfessionalData";
import { ProfessionCardData } from "@/components/Types/ProfessionCardData";
import ServiceCardData from "@/components/Types/ServiceCardData";
import { ServiceData } from "@/components/Types/ServiceData";
import { ServiceInfo } from "@/components/Types/ServiceInfo";
import { UserData } from "@/components/Types/UserData";
import { QueryClient } from "@tanstack/react-query";
import { URL } from "./url";

const queryClient = new QueryClient()

export async function getProfessionals(userId: string): Promise<ProfessionalCardData[]> {
    const response = await fetch(`${URL}/professionals/${encodeURIComponent(userId)}`);
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

export async function getProfessionalAvailableProfessions(id: string): Promise<ProfessionCardData[]> {
    const response = await fetch(`${URL}/professionalAvailableProfessions/${encodeURIComponent(id)}`)
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

export async function getProfessionalsWithProfession(profession: string, id: string): Promise<ProfessionalCardData[]> {
    const response = await fetch(`${URL}/professionalsWithProfession/${encodeURIComponent(profession)}/${encodeURIComponent(id)}`);
    return response.json();
}


export async function updateUser(email: string, body: { name: string; lastName: string; phone: string; street: string, number: number, floor: string, province: string, country: string, description: string }): Promise<UserData> {
    const res = await fetch(`${URL}/user/${encodeURIComponent(email)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        throw new Error("No se pudo actualizar")
    } else {
        queryClient.invalidateQueries({ queryKey: ["FinishedUsedServices"] });
        queryClient.invalidateQueries({ queryKey: ["FinishedProvidedServices"] });
        queryClient.invalidateQueries({ queryKey: ["User"] });
        queryClient.invalidateQueries({ queryKey: ["professional"] });
        queryClient.invalidateQueries({ queryKey: ["ProviderActiveServices"] });
        queryClient.invalidateQueries({ queryKey: ["UserActiveServices"] });
        queryClient.invalidateQueries({ queryKey: ["professionalProfessions"] });
        queryClient.invalidateQueries({ queryKey: ["professionals"] });
        queryClient.invalidateQueries({ queryKey: ["userInfo"] });
        queryClient.invalidateQueries({ queryKey: ["serviceInfo"] });
        queryClient.invalidateQueries({ queryKey: ["professions"] });
    }
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

export async function createService(serviceData: ServiceData) {
    const response = await fetch(`${URL}/createService`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
    });

    if (!response.ok) {
        throw new Error('Error al crear el servicio');
    } else {
        queryClient.invalidateQueries({ queryKey: ["FinishedUsedServices"] });
        queryClient.invalidateQueries({ queryKey: ["FinishedProvidedServices"] });
        queryClient.invalidateQueries({ queryKey: ["User"] });
        queryClient.invalidateQueries({ queryKey: ["professional"] });
        queryClient.invalidateQueries({ queryKey: ["ProviderActiveServices"] });
        queryClient.invalidateQueries({ queryKey: ["UserActiveServices"] });
        queryClient.invalidateQueries({ queryKey: ["professionalProfessions"] });
        queryClient.invalidateQueries({ queryKey: ["professionals"] });
        queryClient.invalidateQueries({ queryKey: ["userInfo"] });
        queryClient.invalidateQueries({ queryKey: ["serviceInfo"] });
        queryClient.invalidateQueries({ queryKey: ["professions"] });
    }

    return response.json();
};

export async function getUserIdAndAddressId(email: string): Promise<{ userId: number, addressId: number }> {
    const response = await fetch(`${URL}/userIdAndAddress/${encodeURIComponent(email)}`);
    return response.json();
}

export async function addProfession(data: { userId: string | undefined, professionId: string }) {
    const response = await fetch(`${URL}/addProfession`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Error al agregar profesion');
    }else{
        queryClient.invalidateQueries({ queryKey: ["FinishedUsedServices"] });
        queryClient.invalidateQueries({ queryKey: ["FinishedProvidedServices"] });
        queryClient.invalidateQueries({ queryKey: ["User"] });
        queryClient.invalidateQueries({ queryKey: ["professional"] });
        queryClient.invalidateQueries({ queryKey: ["ProviderActiveServices"] });
        queryClient.invalidateQueries({ queryKey: ["UserActiveServices"] });
        queryClient.invalidateQueries({ queryKey: ["professionalProfessions"] });
        queryClient.invalidateQueries({ queryKey: ["professionals"] });
        queryClient.invalidateQueries({ queryKey: ["userInfo"] });
        queryClient.invalidateQueries({ queryKey: ["serviceInfo"] });
        queryClient.invalidateQueries({ queryKey: ["professions"] });
        queryClient.invalidateQueries({ queryKey: ["pintorProfessionals"] });
        queryClient.invalidateQueries({ queryKey: ["plomeroProfessionals"] });
        queryClient.invalidateQueries({ queryKey: ["limpiezaProfessionals"] });
        queryClient.invalidateQueries({ queryKey: ["gasistaProfessionals"] });
        queryClient.invalidateQueries({ queryKey: ["paseadorProfessionals"] });
        queryClient.invalidateQueries({ queryKey: ["electricistaProfessionals"] });
        queryClient.invalidateQueries({ queryKey: ["entrenadorProfessionals"] });
    }

    return response.json();
};

export async function deleteProfession(data: { userId: string | undefined, professionId: string }) {
    const response = await fetch(`${URL}/deleteProfession`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Error al eliminar profesion');
    }else{
        queryClient.invalidateQueries({ queryKey: ["FinishedUsedServices"] });
        queryClient.invalidateQueries({ queryKey: ["FinishedProvidedServices"] });
        queryClient.invalidateQueries({ queryKey: ["User"] });
        queryClient.invalidateQueries({ queryKey: ["professional"] });
        queryClient.invalidateQueries({ queryKey: ["ProviderActiveServices"] });
        queryClient.invalidateQueries({ queryKey: ["UserActiveServices"] });
        queryClient.invalidateQueries({ queryKey: ["professionalProfessions"] });
        queryClient.invalidateQueries({ queryKey: ["professionals"] });
        queryClient.invalidateQueries({ queryKey: ["userInfo"] });
        queryClient.invalidateQueries({ queryKey: ["serviceInfo"] });
        queryClient.invalidateQueries({ queryKey: ["professions"] });
        queryClient.invalidateQueries({ queryKey: ["pintorProfessionals"] });
        queryClient.invalidateQueries({ queryKey: ["plomeroProfessionals"] });
        queryClient.invalidateQueries({ queryKey: ["limpiezaProfessionals"] });
        queryClient.invalidateQueries({ queryKey: ["gasistaProfessionals"] });
        queryClient.invalidateQueries({ queryKey: ["paseadorProfessionals"] });
        queryClient.invalidateQueries({ queryKey: ["electricistaProfessionals"] });
        queryClient.invalidateQueries({ queryKey: ["entrenadorProfessionals"] });
    }

    return response.json();
};

export async function getServiceInfoById(id: string): Promise<ServiceInfo> {
    const response = await fetch(`${URL}/serviceInfo/${encodeURIComponent(id)}`);
    return response.json();
}

export async function updatePicture(data: {userId: number, pictureUrl: string}) {
    const response = await fetch(`${URL}/user/picture`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Error al cambiar la foto de perfil');
    }else{
        queryClient.invalidateQueries({ queryKey: ["FinishedUsedServices"] });
        queryClient.invalidateQueries({ queryKey: ["FinishedProvidedServices"] });
        queryClient.invalidateQueries({ queryKey: ["User"] });
        queryClient.invalidateQueries({ queryKey: ["professional"] });
        queryClient.invalidateQueries({ queryKey: ["ProviderActiveServices"] });
        queryClient.invalidateQueries({ queryKey: ["UserActiveServices"] });
        queryClient.invalidateQueries({ queryKey: ["professionalProfessions"] });
        queryClient.invalidateQueries({ queryKey: ["professionals"] });
        queryClient.invalidateQueries({ queryKey: ["userInfo"] });
        queryClient.invalidateQueries({ queryKey: ["serviceInfo"] });
        queryClient.invalidateQueries({ queryKey: ["professions"] });
        queryClient.invalidateQueries({ queryKey: ["pintorProfessionals"] });
        queryClient.invalidateQueries({ queryKey: ["plomeroProfessionals"] });
        queryClient.invalidateQueries({ queryKey: ["limpiezaProfessionals"] });
        queryClient.invalidateQueries({ queryKey: ["gasistaProfessionals"] });
        queryClient.invalidateQueries({ queryKey: ["paseadorProfessionals"] });
        queryClient.invalidateQueries({ queryKey: ["electricistaProfessionals"] });
        queryClient.invalidateQueries({ queryKey: ["entrenadorProfessionals"] });
    }

    return response.json();
};