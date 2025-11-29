# Apps-Moviles-Front

## Get started

1. Install dependencies

   ```bash
   npm install
   ```
2. Change the ip address in /api/url.ts

   ```
   const PORT = '3000'; <-- If you want to change the port make sure to change it on the backend too.
   const IP = 'YOUR_IP_ADDRESS'; <-- Put ypur ip address here.

   export const URL = `http://${IP}:${PORT}/FixIt`
   ```

3. Start the app

   ```bash
   npx expo start
   ```

