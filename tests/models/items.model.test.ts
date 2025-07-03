jest.mock('better-sqlite3', () => {
	return jest.fn().mockImplementation(() => ({
		prepare: jest.fn().mockReturnValue({
			run: jest.fn(),
			get: jest.fn(),
			all: jest.fn(),
		}),
		exec: jest.fn(),
	}));
});

import { v4 as uuidv4 } from 'uuid';

import itemsModel from '../../src/models/items.model';
import db from '../../src/services/database.service';

jest.mock('uuid');
jest.mock('../../src/services/database.service');

describe('items.model', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('createItem', () => {
		it('Should add a new item', () => {
			const date = new Date('2025-01-01 00:00:00');
			jest.useFakeTimers().setSystemTime(date);
			const itemId = 'test-item-id-1';
			const userId = 'test-user-id-1';
			const blob = 'test-blob-1';
			const iv = 'test-iv-1';
			const runMock = jest.fn();
			runMock.mockReturnValue(true);
			(db.prepare as jest.Mock).mockReturnValue({ run: runMock });
			(uuidv4 as jest.Mock).mockReturnValue(itemId);
			const data = itemsModel.createItem({ blob, iv }, userId);
			expect(data).toEqual({
				id: itemId,
				userId,
				blob,
				iv,
				createdAt: date.toISOString(),
				updatedAt: date.toISOString(),
			});
		});
	});

	describe('fetchItems', () => {
		it('Should fetch all items for a user', () => {
			const userId = 'test-user-id-1';
			const itemsMock = [
				{
					id: 'test-item-id-1',
					userId,
					blob: 'test-blob-1',
					iv: 'test-iv-1',
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
				{
					id: 'test-item-id-2',
					userId,
					blob: 'test-blob-2',
					iv: 'test-iv-2',
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
			];
			const allMock = jest.fn();
			allMock.mockReturnValue(itemsMock);
			(db.prepare as jest.Mock).mockReturnValue({ all: allMock });
			const data = itemsModel.fetchItems(userId);
			expect(data).toEqual(itemsMock);
		});
	});

	describe('fetchItemById', () => {
		it('Should fetch an item by its ID', () => {
			const id = 'test-item-id-1';
			const userId = 'test-user-id-1';
			const itemMock = {
				id,
				userId,
				blob: 'test-blob-1',
				iv: 'test-iv-1',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};
			const getMock = jest.fn();
			getMock.mockReturnValue(itemMock);
			(db.prepare as jest.Mock).mockReturnValue({ get: getMock });
			const data = itemsModel.fetchItemById(id, userId);
			expect(data).toEqual(itemMock);
		});
	});

	describe('updateItem', () => {
		it('Should update the item record', () => {
			const id = 'test-item-id-1';
			const userId = 'test-user-id-1';
			const updates = {
				blob: 'updated-blob-id',
				iv: 'updated-iv',
			};
			const runMock = jest.fn();
			runMock.mockReturnValue(true);
			(db.prepare as jest.Mock).mockReturnValue({ run: runMock });
			const data = itemsModel.updateItem(updates, id, userId);
			expect(db.prepare).toHaveBeenCalledWith(
				'UPDATE items SET blob = @blob, iv = @iv, updatedAt = @updatedAt WHERE id = @id AND userId = @userId'
			);
			expect(data).toEqual(true);
		});

		it('Should throw an error if no updates have been provided', () => {
			const id = 'test-item-id-1';
			const userId = 'test-user-id-1';
			const updates = {};
			expect(() => itemsModel.updateItem(updates, id, userId)).toThrow(
				'No updates provided.'
			);
		});
	});

	describe('softDeleteItem', () => {
		it('Should update the item and set a deletedAt value', () => {
			const id = 'test-item-id-1';
			const userId = 'test-user-id-1';
			const runMock = jest.fn();
			runMock.mockReturnValue(true);
			(db.prepare as jest.Mock).mockReturnValue({ run: runMock });
			itemsModel.softDeleteItem(id, userId);
			expect(db.prepare).toHaveBeenCalledWith(
				'UPDATE items SET deletedAt = @deletedAt WHERE id = @id AND userId = @userId'
			);
		});
	});

	describe('deleteItem', () => {
		it('Should delete the item', () => {
			const id = 'test-item-id-1';
			const userId = 'test-user-id-1';
			const runMock = jest.fn();
			runMock.mockReturnValue(true);
			(db.prepare as jest.Mock).mockReturnValue({ run: runMock });
			itemsModel.deleteItem(id, userId);
			expect(db.prepare).toHaveBeenCalledWith(
				'DELETE FROM items WHERE id = @id AND userId = @userId'
			);
		});
	});
});
