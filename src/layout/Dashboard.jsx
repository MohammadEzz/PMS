import { Drawer } from '@mui/material';
import { Box } from '@mui/system';
import '@/api.config';
import Menu from '@/components/menu/Menu';
import { Outlet } from 'react-router-dom';

export default function Dashboard() {

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Drawer
          sx={{
            width: 220,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 220,
              boxSizing: 'border-box',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Menu />
        </Drawer>

          <Box sx={{ flexGrow: 1 }}>
            <Box>
              <Outlet />
            </Box>
          </Box>

        </Box>   
    </>
  );
}