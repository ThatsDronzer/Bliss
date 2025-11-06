// Domain models for Listing entity
export interface IListingImage {
	url: string;
	public_id: string;
}

export interface IListingItem {
	name: string;
	description: string;
	image: IListingImage;
	price: number;
}

export interface IListing {
	_id?: string;
	title: string;
	description: string;
	price: number;
	images?: IListingImage[];
	isActive: boolean;
	features?: string[];
	location: string;
	owner: string;
	reviews?: string[];
	items?: IListingItem[];
	createdAt?: Date;
	updatedAt?: Date;
}

export interface ICreateListingInput {
	title: string;
	description: string;
	price: number;
	images?: IListingImage[];
	isActive?: boolean;
	features?: string[];
	location: string;
	owner: string;
	items?: IListingItem[];
}

export interface IUpdateListingInput {
	title?: string;
	description?: string;
	price?: number;
	images?: IListingImage[];
	isActive?: boolean;
	features?: string[];
	location?: string;
	items?: IListingItem[];
}

