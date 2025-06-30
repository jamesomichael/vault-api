export interface LocalUserDto {
	id: string;
	username: string;
}

export interface UserDto {
	id: string;
	username: string;
	hashedPassword: string;
	authSalt: string;
	vaultSalt: string;
}
