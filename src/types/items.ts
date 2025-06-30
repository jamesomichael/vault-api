export interface CreateItemDto {
	blob: string;
	iv: string;
}

export interface UpdateItemDto {
	blob?: string;
	iv?: string;
}

export interface ItemDto {
	id: string;
	userId: string;
	blob: string;
	iv: string;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
}
