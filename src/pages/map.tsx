import { useRef, useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { Grid } from '@/components/tile-map/grid';
import { SCENE_ID, TileConfig } from '@/lib/map-editor/types';
import { centralChamber } from '@/lib/scenes/central-chamber';
import { tss } from '@/styles';
import { useTheme } from '@/styles/hooks/use-theme';
import { southernChamber } from '@/lib/scenes/southern-chamber';

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
export const scenes: Record<SCENE_ID, TileConfig[][]> = {
	[SCENE_ID.CENTRAL_CHAMBER]: centralChamber,
	[SCENE_ID.SOUTHERN_CHAMBER]: southernChamber,
};

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
							wallColor={theme.colors.gray800}
							ceilingColor={theme.colors.gray700}
							wallHeight={16}
							onEntryClick={(sceneId) => {
								setRoom(sceneId);
							}}
						/>
					</div>
				</CSSTransition>
			</SwitchTransition>
		</div>
	);
}
