type NotificationSubscriber<T> = (payload: T) => void;

export type NotificationPublisherComponents = object;

export type NotificationPublisherSystems<T> = {
	notify(): void;
	subscribe(notificationSubscriber: NotificationSubscriber<T>): () => void;
};

export type NotificationPublisher<T> = NotificationPublisherComponents & NotificationPublisherSystems<T>;

export function notificationPublisher<T>(payload: T): NotificationPublisher<T> {
	const notificationSubscribers = new Set<NotificationSubscriber<T>>();

	function notify() {
		for (const notificationSubscriber of notificationSubscribers) {
			try {
				notificationSubscriber(payload);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(`notificationSubscriber threw error: ${error}`);
			}
		}
	}

	function subscribe(notificationSubscriber: NotificationSubscriber<T>): () => void {
		notificationSubscribers.add(notificationSubscriber);
		notificationSubscriber(payload);
		return () => {
			notificationSubscribers.delete(notificationSubscriber);
		};
	}

	return { notify, subscribe };
}
