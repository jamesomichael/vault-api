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
