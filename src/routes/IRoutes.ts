export default interface IRoutes {
	path: string;
	visibleInDisplay?: boolean;
	displayName?: string;
	protected: boolean;
	adminOnly?: boolean;
	component: () => React.ReactNode;
	icon?: () => JSX.Element | React.ReactNode | null;
}
