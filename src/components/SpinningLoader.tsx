import { Box } from "@mui/material";

const SpinningLoader = () => {
  return (
    <Box className="fixed inset-0 flex items-center justify-center">
      <Box className="w-10 h-10 border-4 border-transparent border-t-black rounded-full animate-spin" />
    </Box>
  );
};

export default SpinningLoader;
