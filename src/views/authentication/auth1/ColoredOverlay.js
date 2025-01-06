import { Box } from "@mui/system";

export default function ColoredOverlay() {
    return <Box sx={{ bgcolor: (theme) => `${theme.palette.primary.main}70` }} className="absolute  top-0 left-0 right-0 bottom-0 opacity-30">

    </Box>
}