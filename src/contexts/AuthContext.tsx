import { useState, createContext, useContext, ReactNode, useEffect } from 'react';

export type UserType = {
	id: string | number;
	name: string;
	email: string;
	cpf: string;
	phone: string;
	is_admin: number;
	email_verified_at: string | null;
	created_at: string;
	updated_at: string;
};

export type LoginResponse = {
	status: string;
	message: string;
	data: {
		user: UserType;
		token: string;
		token_type: string;
		expires_in: string;
	};
};

export type LoadUser = {
	status: string;
	message: string;
	data: UserType;
};

type AuthContextType = {
	user: UserType | null;
	token: string | null;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
	isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
	user: null,
	token: null,
	login: async () => {},
	logout: () => {},
	isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<UserType | null>(null);
	const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadUser = async () => {
			if (token) {
				try {
					const request = await fetch('https://api-sport-reserve.juvhost.com/api/v1/auth/user', {
						method: 'GET',
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});
					const data: LoadUser = await request.json();
					if (data.status === 'success') {
						setUser(data.data);
					} else {
						logout();
					}
				} catch (error) {
					logout();
				}
			}
			setIsLoading(false);
		};

		loadUser();
	}, [token]);

	const login = async (email: string, password: string) => {
		try {
			const request = await fetch('https://api-sport-reserve.juvhost.com/api/v1/auth/signin', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});
			const data: LoginResponse = await request.json();
			if (request.ok && data.status === 'success') {
				setUser(data.data.user);
				setToken(data.data.token);
				localStorage.setItem('token', data.data.token);
			} else {
				throw new Error(data.message);
			}
		} catch (error) {
			throw new Error('Failed to login');
		}
	};

	const logout = () => {
		fetch('https://api-sport-reserve.juvhost.com/api/v1/auth/signout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
			.then(resp => resp.json())
			.then(() => {
				setUser(null);
				setToken(null);
				localStorage.removeItem('token');
			})
			.catch(() => {
				setUser(null);
				setToken(null);
				localStorage.removeItem('token');
			});
	};

	return <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>{children}</AuthContext.Provider>;
};
