import db from '../services/database.service';

interface UserDto {
	id: string;
	username: string;
}

const fetchLocalUsers = (): UserDto[] => {
	const statement = db.prepare('SELECT id, username FROM users');
	const items = statement.all() as UserDto[];
	return items;
};

export default { fetchLocalUsers };
