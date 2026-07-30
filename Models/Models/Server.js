

require('dotenv').config();

import { listen } from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 5000;


import './models';

connectDB().then(() => {
  listen(PORT, () => {
    console.log(`VMS backend listening on http://localhost:${PORT}`);
  });
});

startserver();
