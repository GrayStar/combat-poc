import { Grid } from '@/components/tile-map/grid';
import { tss } from '@/styles';
import { useTheme } from '@/styles/hooks/use-theme';
import { useRef, useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

const useStyles = tss.create(() => ({
	fadeEnter: {
		opacity: 0,
	},
	fadeEnterAcitve: {
		opacity: 1,
		transition: 'opacity 200ms',
	},
	fadeExit: {
		opacity: 1,
	},
	fadeExitActive: {
		opacity: 0,
		transition: 'opacity 200ms',
	},
}));

const centralRoom: number[][] = [
	[0, 0, 1, 1, 2, 1, 1, 1, 0, 0],
	[0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[2, 0, 1, 0, 0, 0, 0, 1, 0, 1],
	[1, 0, 0, 0, 1, 1, 0, 0, 0, 2],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
	[0, 0, 1, 1, 2, 1, 1, 1, 0, 0],
];

const southRoom: number[][] = [
	[1, 1, 2, 1, 1],
	[1, 0, 0, 0, 1],
	[1, 0, 0, 0, 1],
	[1, 1, 1, 1, 1],
];

enum SCENE_ID {
	CENTRAL_ROOM = 'CENTRAL_ROOM',
	SOUTH_ROOM = 'SOUTH_ROOM',
}

const scenes = {
	[SCENE_ID.CENTRAL_ROOM]: centralRoom,
	[SCENE_ID.SOUTH_ROOM]: southRoom,
};

export function MapDemo() {
	const { classes } = useStyles();
	const { theme } = useTheme();
	const [room, setRoom] = useState<SCENE_ID>(SCENE_ID.CENTRAL_ROOM);
	const nodeRef = useRef<HTMLDivElement>(null);

	return (
		<div className="p-4">
			<SwitchTransition>
				<CSSTransition
					key={room}
					nodeRef={nodeRef}
					timeout={200}
					classNames={{
						enter: classes.fadeEnter,
						enterActive: classes.fadeEnterAcitve,
						exit: classes.fadeExit,
						exitActive: classes.fadeExitActive,
					}}
					mountOnEnter
					unmountOnExit
				>
					<div ref={nodeRef}>
						<Grid
							data={scenes[room]}
							tileSize={48}
							borderRadius={8}
							wallColor={theme.colors.gray800}
							ceilingColor={theme.colors.gray700}
							wallHeight={16}
							onEntryClick={() => {
								setRoom(SCENE_ID.SOUTH_ROOM);
							}}
						/>
					</div>
				</CSSTransition>
			</SwitchTransition>
		</div>
	);
}
