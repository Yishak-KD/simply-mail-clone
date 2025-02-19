import { Box } from '@mui/material';

const SlidingLoader = () => {
  return (
    <Box className="relative w-[10%] h-2 bg-gray-200 mx-auto mt-10 overflow-hidden rounded-full">
      <Box className="absolute top-0 left-0 w-1/3 h-full  bg-black animate-slide" />
    </Box>
  );
};

export default SlidingLoader;
