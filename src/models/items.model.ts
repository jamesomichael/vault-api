import { v4 as uuidv4 } from 'uuid';

import db from '../services/database.service';

interface CreateItemDto {
	blob: string;
	iv: string;
}

interface ItemDto {
	id: string;
	userId: string;
	blob: string;
	iv: string;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
}

const createItem = ({ blob, iv }: CreateItemDto, userId: string): ItemDto => {
	const item = {
		id: uuidv4(),
		userId,
		blob,
		iv,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	const statement = db.prepare(
		'INSERT INTO items (id, userId, blob, iv, createdAt, updatedAt) VALUES (@id, @userId, @blob, @iv, @createdAt, @updatedAt)'
	);
	statement.run(item);
	return item;
};

const fetchItems = (userId: string): ItemDto[] => {
	const statement = db.prepare('SELECT * FROM items WHERE userId = @userId');
	const items = statement.all({ userId }) as ItemDto[];
	return items;
};

const fetchItemById = (id: string, userId: string): ItemDto => {
	const statement = db.prepare(
		'SELECT * FROM items WHERE id = @id AND userId = @userId'
	);
	const item = statement.get({ id, userId }) as ItemDto;
	return item;
};

export default { createItem, fetchItems, fetchItemById };
