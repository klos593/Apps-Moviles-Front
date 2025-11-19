import Address from "./Address";

type ServiceCardData = {
    id: string;
    name: string;
    lastName: string;
    profession: string;
    date: string;
    state: String;
    address: Address;
    isReviewed: boolean;
}

export default ServiceCardData;