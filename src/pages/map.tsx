import { useRef, useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { Grid } from '@/components/tile-map/grid';
import { SCENE_ID, scenes } from '@/lib/scenes/types';
import { tss } from '@/styles';
import { useTheme } from '@/styles/hooks/use-theme';

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

export function MapDemo() {
	const { classes } = useStyles();
	const { theme } = useTheme();
	const [room, setRoom] = useState<SCENE_ID>(SCENE_ID.CENTRAL_CHAMBER);
	const nodeRef = useRef<HTMLDivElement>(null);

	return (
		<div className="w-100 d-flex align-items-center justify-content-center">
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
							floorColor={theme.colors.gray800}
							wallColor={theme.colors.gray700}
							ceilingColor={theme.colors.gray600}
							wallHeight={16}
							onDoorClick={(mapObjectDoor) => {
								setRoom(mapObjectDoor.sceneId);
							}}
						/>
					</div>
				</CSSTransition>
			</SwitchTransition>
		</div>
	);
}
