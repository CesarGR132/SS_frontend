import os from 'os';

export const getApiAddress = async () => {
    const nets = os.networkInterfaces();
    const results: Record<string, string[]> = {};

    for (const name of Object.keys(nets)) {
        for (const net of nets[name] ?? []) {
          if (net.internal === false) {
            results[name] = results[name] || [];
            results[name].push(net.address);
          }
        }
      }
      console.log(results['Wi-Fi'][3])
      return results['Wi-Fi'][3];
}

export const getIpAddress = (): string | undefined => {
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name] ?? []) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    // if no network interfaces found, return 'localhost'
    return '192.168.1.77';
}