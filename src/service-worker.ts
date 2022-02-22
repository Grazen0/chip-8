import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

registerRoute(
	({ request }) => ['style', 'script', 'worker'].includes(request.destination),
	new StaleWhileRevalidate({
		cacheName: 'assets',
		plugins: [
			new CacheableResponsePlugin({
				statuses: [200],
			}),
		],
	})
);

registerRoute(({ url }) => url.pathname.endsWith('.ch8'), new CacheFirst());
