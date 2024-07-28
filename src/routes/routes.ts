import routesSite from './routesSite';
import routesAuth from './routesAuth';
import routesDash from './routesDash';

const routes = [...routesSite, ...routesAuth, ...routesDash];

export default routes;
