import { NextFunction, Request, Response } from 'express';

import itemsController from '../../src/controllers/items.controller';
import itemsModel from '../../src/models/items.model';

import type { AuthorisedRequest } from '../../src/types/auth';

jest.mock('../../src/models/items.model');

describe('items.controller', () => {
	const req: Partial<Request> = { body: {} };
	let res: Partial<Response>;
	let next: Partial<NextFunction>;
	let statusMock: jest.Mock;
	let jsonMock: jest.Mock;
	let sendMock: jest.Mock;

	beforeEach(() => {
		jest.clearAllMocks();
		statusMock = jest.fn().mockReturnThis();
		jsonMock = jest.fn();
		sendMock = jest.fn();
		res = {
			status: statusMock,
			json: jsonMock,
			send: sendMock,
		};
		next = jest.fn();
	});

	describe('createItem', () => {
		it('Should successfully create a new vault item', async () => {
			const ts = new Date().toISOString();
			(itemsModel.createItem as jest.Mock).mockReturnValue({
				id: 'test-item-id-1',
				userId: 'test-user-id',
				blob: 'test-blob',
				iv: 'test-iv',
				createdAt: ts,
				updatedAt: ts,
			});
			(req as AuthorisedRequest).user = { id: 'test-user-id' };
			await itemsController.createItem(
				req as AuthorisedRequest,
				res as Response,
				next as NextFunction
			);
			expect(statusMock).toHaveBeenCalledWith(200);
			expect(jsonMock).toHaveBeenCalledWith({
				id: 'test-item-id-1',
				userId: 'test-user-id',
				blob: 'test-blob',
				iv: 'test-iv',
				createdAt: ts,
				updatedAt: ts,
			});
		});

		it('Should respond with a 500 if an error is thrown', async () => {
			(itemsModel.createItem as jest.Mock).mockImplementation(() => {
				throw new Error('Failed to create item.');
			});
			(req as AuthorisedRequest).user = { id: 'test-user-id' };
			await itemsController.createItem(
				req as AuthorisedRequest,
				res as Response,
				next as NextFunction
			);
			expect(statusMock).toHaveBeenCalledWith(500);
			expect(jsonMock).toHaveBeenCalledWith({
				message: 'Something went wrong.',
			});
		});
	});

	describe('fetchItems', () => {
		it('Should successfully fetch all vault item for a user', async () => {
			const ts = new Date().toISOString();
			(itemsModel.fetchItems as jest.Mock).mockReturnValue([
				{
					id: 'test-item-id-1',
					userId: 'test-user-id',
					blob: 'test-blob-1',
					iv: 'test-iv-1',
					createdAt: ts,
					updatedAt: ts,
				},
				{
					id: 'test-item-id-2',
					userId: 'test-user-id',
					blob: 'test-blob-2',
					iv: 'test-iv-2',
					createdAt: ts,
					updatedAt: ts,
				},
			]);
			(req as AuthorisedRequest).user = { id: 'test-user-id' };
			await itemsController.fetchItems(
				req as AuthorisedRequest,
				res as Response,
				next as NextFunction
			);
			expect(statusMock).toHaveBeenCalledWith(200);
			expect(jsonMock).toHaveBeenCalledWith([
				{
					id: 'test-item-id-1',
					userId: 'test-user-id',
					blob: 'test-blob-1',
					iv: 'test-iv-1',
					createdAt: ts,
					updatedAt: ts,
				},
				{
					id: 'test-item-id-2',
					userId: 'test-user-id',
					blob: 'test-blob-2',
					iv: 'test-iv-2',
					createdAt: ts,
					updatedAt: ts,
				},
			]);
		});

		it('Should respond with a 500 if an error is thrown', async () => {
			(itemsModel.fetchItems as jest.Mock).mockImplementation(() => {
				throw new Error('Failed to get items.');
			});
			(req as AuthorisedRequest).user = { id: 'test-user-id' };
			await itemsController.fetchItems(
				req as AuthorisedRequest,
				res as Response,
				next as NextFunction
			);
			expect(statusMock).toHaveBeenCalledWith(500);
			expect(jsonMock).toHaveBeenCalledWith({
				message: 'Something went wrong.',
			});
		});
	});

	describe('fetchItemById', () => {
		it('Should successfully fetch a vault item by its ID', async () => {
			const ts = new Date().toISOString();
			(itemsModel.fetchItemById as jest.Mock).mockReturnValue({
				id: 'test-item-id',
				userId: 'test-user-id',
				blob: 'test-blob',
				iv: 'test-iv',
				createdAt: ts,
				updatedAt: ts,
			});
			(req as AuthorisedRequest).user = { id: 'test-user-id' };
			req.params = { id: 'test-item-id' };
			await itemsController.fetchItemById(
				req as AuthorisedRequest,
				res as Response,
				next as NextFunction
			);
			expect(statusMock).toHaveBeenCalledWith(200);
			expect(jsonMock).toHaveBeenCalledWith({
				id: 'test-item-id',
				userId: 'test-user-id',
				blob: 'test-blob',
				iv: 'test-iv',
				createdAt: ts,
				updatedAt: ts,
			});
		});

		it('Should respond with a 404 if the item does not exist', async () => {
			(itemsModel.fetchItemById as jest.Mock).mockReturnValue(undefined);
			(req as AuthorisedRequest).user = { id: 'test-user-id' };
			req.params = { id: 'test-item-id' };
			await itemsController.fetchItemById(
				req as AuthorisedRequest,
				res as Response,
				next as NextFunction
			);
			expect(statusMock).toHaveBeenCalledWith(404);
			expect(jsonMock).toHaveBeenCalledWith({
				message: 'Item not found.',
			});
		});

		it('Should respond with a 500 if an error is thrown', async () => {
			(itemsModel.fetchItemById as jest.Mock).mockImplementation(() => {
				throw new Error('Failed to get item.');
			});
			(req as AuthorisedRequest).user = { id: 'test-user-id' };
			req.params = { id: 'test-item-id' };
			await itemsController.fetchItemById(
				req as AuthorisedRequest,
				res as Response,
				next as NextFunction
			);
			expect(statusMock).toHaveBeenCalledWith(500);
			expect(jsonMock).toHaveBeenCalledWith({
				message: 'Something went wrong.',
			});
		});
	});

	describe('updateItem', () => {
		it('Should successfully update a vault item', async () => {
			const ts = new Date().toISOString();
			const updates = {
				blob: 'test-updated-blob',
				iv: 'test-updated-iv',
			};
			(itemsModel.updateItem as jest.Mock).mockReturnValue(null);
			(itemsModel.fetchItemById as jest.Mock)
				.mockReturnValueOnce({
					id: 'test-item-id',
					userId: 'test-user-id',
					blob: 'test-blob',
					iv: 'test-iv',
					createdAt: ts,
					updatedAt: ts,
				})
				.mockReturnValueOnce({
					id: 'test-item-id',
					userId: 'test-user-id',
					...updates,
					createdAt: ts,
					updatedAt: ts,
				});
			(req as AuthorisedRequest).user = { id: 'test-user-id' };
			req.params = { id: 'test-item-id' };
			req.body = updates;
			await itemsController.updateItem(
				req as AuthorisedRequest,
				res as Response,
				next as NextFunction
			);
			expect(statusMock).toHaveBeenCalledWith(200);
			expect(jsonMock).toHaveBeenCalledWith({
				id: 'test-item-id',
				userId: 'test-user-id',
				...updates,
				createdAt: ts,
				updatedAt: ts,
			});
		});

		it('Should respond with a 404 if the item does not exist', async () => {
			const updates = {
				blob: 'test-updated-blob',
				iv: 'test-updated-iv',
			};
			(itemsModel.fetchItemById as jest.Mock).mockReturnValue(undefined);
			(req as AuthorisedRequest).user = { id: 'test-user-id' };
			req.params = { id: 'test-item-id' };
			req.body = updates;
			await itemsController.updateItem(
				req as AuthorisedRequest,
				res as Response,
				next as NextFunction
			);
			expect(statusMock).toHaveBeenCalledWith(404);
			expect(jsonMock).toHaveBeenCalledWith({
				message: 'Item not found.',
			});
		});

		it('Should respond with a 500 if an error is thrown', async () => {
			const ts = new Date().toISOString();
			const updates = {
				blob: 'test-updated-blob',
				iv: 'test-updated-iv',
			};
			(itemsModel.fetchItemById as jest.Mock).mockReturnValue({
				id: 'test-item-id',
				userId: 'test-user-id',
				blob: 'test-blob',
				iv: 'test-iv',
				createdAt: ts,
				updatedAt: ts,
			});
			(itemsModel.updateItem as jest.Mock).mockImplementation(() => {
				throw new Error('Failed to update item.');
			});
			(req as AuthorisedRequest).user = { id: 'test-user-id' };
			req.params = { id: 'test-item-id' };
			req.body = updates;
			await itemsController.updateItem(
				req as AuthorisedRequest,
				res as Response,
				next as NextFunction
			);
			expect(statusMock).toHaveBeenCalledWith(500);
			expect(jsonMock).toHaveBeenCalledWith({
				message: 'Something went wrong.',
			});
		});
	});

	describe('deleteItem', () => {
		it('Should successfully soft-delete a vault item', async () => {
			const ts = new Date().toISOString();
			(itemsModel.deleteItem as jest.Mock).mockReturnValue(null);
			(itemsModel.fetchItemById as jest.Mock).mockReturnValue({
				id: 'test-item-id',
				userId: 'test-user-id',
				blob: 'test-blob',
				iv: 'test-iv',
				createdAt: ts,
				updatedAt: ts,
			});
			(req as AuthorisedRequest).user = { id: 'test-user-id' };
			req.params = { id: 'test-item-id' };
			await itemsController.deleteItem(
				req as AuthorisedRequest,
				res as Response,
				next as NextFunction
			);
			expect(itemsModel.softDeleteItem).toHaveBeenCalled();
			expect(statusMock).toHaveBeenCalledWith(204);
		});

		it('Should successfully hard-delete a vault item', async () => {
			const ts = new Date().toISOString();
			(itemsModel.deleteItem as jest.Mock).mockReturnValue(null);
			(itemsModel.fetchItemById as jest.Mock).mockReturnValue({
				id: 'test-item-id',
				userId: 'test-user-id',
				blob: 'test-blob',
				iv: 'test-iv',
				createdAt: ts,
				updatedAt: ts,
				deletedAt: ts,
			});
			(req as AuthorisedRequest).user = { id: 'test-user-id' };
			req.params = { id: 'test-item-id' };
			await itemsController.deleteItem(
				req as AuthorisedRequest,
				res as Response,
				next as NextFunction
			);
			expect(itemsModel.deleteItem).toHaveBeenCalled();
			expect(statusMock).toHaveBeenCalledWith(204);
		});

		it('Should respond with a 404 if the item does not exist', async () => {
			(itemsModel.fetchItemById as jest.Mock).mockReturnValue(undefined);
			(req as AuthorisedRequest).user = { id: 'test-user-id' };
			req.params = { id: 'test-item-id' };
			await itemsController.deleteItem(
				req as AuthorisedRequest,
				res as Response,
				next as NextFunction
			);
			expect(statusMock).toHaveBeenCalledWith(404);
			expect(jsonMock).toHaveBeenCalledWith({
				message: 'Item not found.',
			});
		});

		it('Should respond with a 500 if an error is thrown', async () => {
			const ts = new Date().toISOString();
			(itemsModel.fetchItemById as jest.Mock).mockReturnValue({
				id: 'test-item-id',
				userId: 'test-user-id',
				blob: 'test-blob',
				iv: 'test-iv',
				createdAt: ts,
				updatedAt: ts,
			});
			(itemsModel.softDeleteItem as jest.Mock).mockImplementation(() => {
				throw new Error('Failed to delete item.');
			});
			(req as AuthorisedRequest).user = { id: 'test-user-id' };
			req.params = { id: 'test-item-id' };
			await itemsController.deleteItem(
				req as AuthorisedRequest,
				res as Response,
				next as NextFunction
			);
			expect(statusMock).toHaveBeenCalledWith(500);
			expect(jsonMock).toHaveBeenCalledWith({
				message: 'Something went wrong.',
			});
		});
	});
});
